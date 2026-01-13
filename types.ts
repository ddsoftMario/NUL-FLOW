
export type Page = 'home' | 'inbox' | 'history' | 'contacts' | 'settings' | 'data-export' | 'request-flow';
export type Theme = 'light' | 'dark';

export interface UserProfile {
  id: string;
  name: string; // Real name
  screenName?: string; // Display name
  email: string;
  phone: string;
  avatarUrl?: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  group: string; // Flexible string to allow for custom groups
  avatarUrl?: string;
  permissions: {
    canRequestState: boolean;
    canSeeBucketLevel: boolean;
    canSeeBatteryLevel: boolean;
    canSeePrivateNotes: boolean;
  };
}

export interface NulFlowEntry {
  id: string;
  timestamp: Date;
  bucketLevel: number;
  batteryLevel: number;
  moods: string[];
  notes?: string;
  sharedWith?: string[]; // array of contact ids
}
