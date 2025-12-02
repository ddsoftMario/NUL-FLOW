
import { GoogleGenAI, Type } from "@google/genai";
import type { NulFlowEntry } from '../types';

export const checkCrisisPattern = async (history: NulFlowEntry[]): Promise<boolean> => {
  // Do not call API if API_KEY is not set. This is for local development.
  if (!process.env.API_KEY) {
      console.warn("API_KEY environment variable not set. Skipping Gemini API call.");
      
      // Enhanced local check:
      const recentEntries = history.slice(0, 3);
      if (recentEntries.length === 0) return false;

      // 1. Critical Thresholds (strict)
      // High Load (>85) AND Low Energy (<15)
      const isCriticalLevels = recentEntries.some(
          entry => entry.bucketLevel > 85 && entry.batteryLevel < 15
      );
      
      // 2. Concerning Mood Clusters with Moderate Levels
      // If load is moderately high (>70) OR energy moderately low (<30)
      // AND we see negative moods.
      const negativeMoods = ['overwhelmed', 'anxious', 'stressed', 'tired', 'hopeless'];
      const hasNegativeMoods = recentEntries.filter(entry => 
        entry.moods.some(m => negativeMoods.includes(m))
      ).length >= 2;

      const isModerateRisk = recentEntries.some(
        entry => entry.bucketLevel > 70 || entry.batteryLevel < 30
      );

      // Crisis if (Critical Levels) OR (Moderate Levels AND Persistent Negative Moods)
      return Promise.resolve(isCriticalLevels || (isModerateRisk && hasNegativeMoods));
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prepare data for the model. We explicitly include notes now for sentiment analysis.
  // We format the data to be concise and focused on relevant metrics.
  const analysisData = history.map(({ timestamp, bucketLevel, batteryLevel, moods, notes }) => ({
    timestamp: timestamp.toISOString(),
    bucket: bucketLevel, // 0-100 (Load)
    battery: batteryLevel, // 0-100 (Energy)
    moods,
    notes: notes ? notes.substring(0, 500) : undefined // Include notes context, truncated for brevity
  }));

  const prompt = `
    You are an expert mental health wellness monitor. Your goal is to detect early signs of crisis, burnout, or emotional distress in user logs.

    **Data Model:**
    - 'bucket': Mental/Social Load (0-100). High (>80) indicates stress/overwhelm.
    - 'battery': Energy Level (0-100). Low (<20) indicates exhaustion.
    - 'moods': User-selected tags describing their emotional state.
    - 'notes': Personal journal entries.

    **Risk Patterns to Analyze:**
    1. **Immediate Crisis:** 'bucket' > 85 AND 'battery' < 15. The user is overloaded and depleted.
    2. **Burnout Trajectory:** Consistently Low Energy (< 30) regardless of Load, combined with moods like 'tired', 'drained', or 'unmotivated'.
    3. **Hyper-Arousal/Anxiety:** High Load (> 80) combined with High Energy (> 70) often indicates a manic or high-anxiety state before a crash.
    4. **Rapid Deterioration:** Significant negative shifts (e.g., bucket +30% or battery -30%) within 24-48h.
    5. **Emotional Distress:** Persistently negative mood clusters (e.g., 'anxious', 'hopeless') even if levels are moderate.
    6. **Linguistic Flags:** Notes containing language indicating hopelessness, self-harm, severe isolation, or inability to cope.

    **Task:**
    Analyze the log history (most recent first). Determine if the user is in a state requiring intervention.

    Data:
    ${JSON.stringify(analysisData, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                riskLevel: {
                    type: Type.STRING,
                    enum: ["LOW", "MODERATE", "HIGH", "CRITICAL"],
                    description: "The assessed level of risk based on the analysis."
                },
                isCrisis: {
                    type: Type.BOOLEAN,
                    description: "True if the riskLevel is HIGH or CRITICAL, requiring user intervention."
                },
                reasoning: {
                    type: Type.STRING,
                    description: "A concise explanation of the detected pattern (e.g. 'Rapid energy drop combined with hopelessness in notes')."
                }
            }
        },
      }
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    
    console.log(`Gemini Wellness Analysis [${result.riskLevel}]:`, result.reasoning);
    return result.isCrisis === true;

  } catch (error) {
    console.error("Error analyzing wellness pattern with Gemini:", error);
    return false;
  }
};
