



// Fix: Convert JSON object to a TypeScript module with a default export.
export default {
  "nav": {
    "home": "Home",
    "inbox": "Inbox",
    "history": "Connection Log",
    "contacts": "Connection Circle",
    "dataExport": "Data Export",
    "settings": "Settings",
    "installApp": "Install App",
    "shareApp": "Share App"
  },
  "share": {
    "text": "Check out NUL flow, a great app for tracking your wellness.",
    "messageTemplate": "My NUL Flow Update:\n🪣 Load: {{bucket}}%\n🔋 Energy: {{battery}}%{{moods}}{{notes}}",
    "emailSubject": "My NUL Flow Update"
  },
  "home": {
    "subtitle": "A universal language for neuro-connection.",
    "tagline": "Translate your mental state. Share your capacity, not just your feelings.",
    "sendFlow": "Send Your NUL Flow",
    "getFlow": "Get NUL Flow",
    "sendFlowCardTitle": "Send Your NUL Flow",
    "sendFlowCardDesc": "Share your current state with trusted contacts",
    "startSharing": "Start Sharing",
    "getFlowCardTitle": "Get NUL Flow",
    "getFlowCardDesc": "Request wellness updates from your contacts",
    "requestUpdates": "Request Updates"
  },
  "inbox": {
    "emptyTitle": "Your inbox is empty",
    "emptyDesc": "When your connections share their NUL flow with you, it will appear here."
  },
  "history": {
    "title": "Connection Log",
    "description": "Review your shared states and discover patterns in your neuro-connection.",
    "avgBucket": "Avg. Bucket",
    "bucketAvgDesc": "Social load average",
    "avgBattery": "Avg. Battery",
    "batteryAvgDesc": "Energy level average",
    "totalEntries": "Total Logs",
    "totalEntriesDesc": "Shared states",
    "shared": "Shared",
    "bucket": "Bucket",
    "socialLoad": "Social Load",
    "battery": "Battery",
    "energy": "Energy",
    "moodTags": "Mood Tags:",
    "note": "Note:"
  },
  "contacts": {
    "title": "Your Connection Circle",
    "description": "Manage the trusted people you share your mental state with.",
    "searchPlaceholder": "Search all contacts...",
    "quickAdd": "Quick Add",
    "newGroup": "New Group",
    "all": "All",
    "showingContacts": "Showing {{count}} of {{total}} contacts",
    "noContactsFound": "No contacts found matching your filters.",
    "sharingPermissions": "Sharing Permissions:",
    "canRequestState": "Can request my state",
    "canSeeBucket": "Can see bucket level",
    "canSeeBattery": "Can see battery level",
    "canSeeNotes": "Can see private notes",
    "editContact": "Edit Contact",
    "name": "Name",
    "email": "Email",
    "phone": "Phone",
    "group": "Group",
    "save": "Save",
    "cancel": "Cancel",
    "confirmDeleteTitle": "Confirm Deletion",
    "confirmDeleteMessage": "This action cannot be undone. Are you sure you want to permanently delete this contact from your network?",
    "delete": "Delete",
    "newContactName": "New Contact",
    "enterGroupName": "Enter a name for the new group:",
    "groupNameExists": "A group with this name already exists.",
    "groupCreatedNote": "New group created! You can now assign it to contacts in edit mode."
  },
  "requestFlow": {
    "title": "Request NUL Flow",
    "description": "Select connections you'd like to request a wellness update from.",
    "searchPlaceholder": "Search by name...",
    "noContacts": "You have no contacts that allow requests. Ask them to enable 'Can request my state' in their settings for you.",
    "sendRequest": "Send Request",
    "requestSent": "Request Sent!",
    "noContactInfo": "No phone/email",
    "smsTemplate": "Hey {{name}}, I'm checking in. Could you share your NUL flow status with me?",
    "emailSubject": "NUL Flow Request",
    "emailBody": "Hey {{name}},\n\nI hope you're doing well. I'm checking in via NUL Flow.\nCould you share your current status (Bucket/Battery) with me?\n\nBest,"
  },
  "contactGroups": {
    "Family": "Family",
    "Friend": "Friend",
    "Therapist": "Therist",
    "Partner": "Partner"
  },
  "settings": {
    "title": "Settings",
    "description": "Customize your NUL wellness experience.",
    "appearance": "Appearance",
    "darkMode": "Dark Mode",
    "darkModeDesc": "Switch between light and dark themes",
    "notifications": "Notifications",
    "bucketOverflow": "Bucket Overflow Alerts",
    "bucketOverflowDesc": "Get notified when your bucket is nearly full",
    "lowBattery": "Low Battery Alerts",
    "lowBatteryDesc": "Get notified when your energy is running low",
    "dailyCheckin": "Daily Check-in Reminders",
    "dailyCheckinDesc": "Gentle reminders to log your wellness state",
    "weeklyReports": "Weekly Reports",
    "weeklyReportsDesc": "Summary of your wellness patterns",
    "privacy": "Privacy & Security",
    "shareLocation": "Share Location Data",
    "shareLocationDesc": "Help improve location-based insights",
    "analytics": "Analytics",
    "analyticsDesc": "Anonymous usage data to improve service",
    "crashReporting": "Crash Reporting",
    "crashReportingDesc": "Help us fix bugs and improve stability",
    "dataSecure": "Your wellness data is secure and encrypted.",
    "about": "About NUL flow",
    "aboutDesc": "This app has been created by 1013th with the help of DDSoft for the neurodivergent community out there."
  },
  "dataExport": {
    "title": "Data Export",
    "description": "Export your wellness history for therapy sessions or personal review.",
    "selectPeriod": "Select Period",
    "last7Days": "Last 7 Days",
    "last30Days": "Last 30 Days",
    "allTime": "All Time",
    "custom": "Custom",
    "to": "to",
    "additionalFilters": "Additional Filters",
    "sharedOnly": "Shared Only",
    "filterByMood": "Filter by Mood",
    "entriesFound": "{{count}} entries found",
    "noEntries": "No entries in the selected period.",
    "exportCSV": "Export as CSV"
  },
  "wizard": {
    "steps": {
      "setLevels": "Calibrate State",
      "addDetails": "Add Context",
      "shareSave": "Share & Log"
    },
    "setLevels": {
      "title": "Set Your Current Levels",
      "description": "Drag up or down on the visuals to adjust.",
      "socialLoad": "Social Load",
      "energy": "Energy",
      "levels": {
        "low": "Low",
        "moderate": "Moderate",
        "high": "High",
        "critical": "Critical",
        "good": "Good"
      }
    },
    "addDetails": {
      "title": "Add Context (Optional)",
      "description": "Add notes or tags to remember how you felt.",
      "feeling": "How are you feeling?",
      "selectMoods": "Select moods that apply",
      "addOwnMood": "Add your own mood...",
      "additionalNotes": "Additional notes",
      "notesPlaceholder": "What's on your mind? What happened today?"
    },
    "shareSave": {
      "title": "Share & Save",
      "description": "Choose who to share with, or just save for yourself.",
      "shareWithContacts": "Share with Contacts",
      "searchPlaceholder": "Search contacts...",
      "addMoreContacts": "Add More Contacts",
      "sendToContacts": "Send to {{count}} Contact(s)",
      "saveForMyself": "Save / Finish"
    },
    "buttons": {
      "next": "Next Step",
      "back": "Back"
    }
  },
  "moods": {
    "stressed": "stressed",
    "overwhelmed": "overwhelmed",
    "calm": "calm",
    "energized": "energized",
    "tired": "tired",
    "anxious": "anxious",
    "peaceful": "peaceful",
    "focused": "focused"
  },
  "crisisModal": {
    "title": "Wellness Alert",
    "description1": "Our AI wellness monitor has detected a concerning pattern in your recent entries (e.g., sustained high mental load and low energy).",
    "description2": "Would you like to notify your top 3 support contacts?",
    "notifyButton": "Notify Support Network",
    "dismissButton": "Dismiss"
  },
  "languages": {
    "select": "Select Language"
  },
  "onboarding": {
    "title": "Welcome to NUL flow",
    "subtitle": "The first step to translating your mental state into a universal language.",
    "bucketTitle": "The Bucket",
    "bucketDesc": "Represents your mental and social load. A full bucket means you're overwhelmed.",
    "batteryTitle": "The Battery",
    "batteryDesc": "Represents your energy level. A low battery means you're drained.",
    "closeButton": "Get Started"
  },
  "profileSetup": {
    "title": "Who are you?",
    "subtitle": "Let's set up your profile so your friends know who is sharing their flow.",
    "nameLabel": "Your Name",
    "namePlaceholder": "Jane Doe",
    "emailLabel": "Email Address",
    "phoneLabel": "Phone Number",
    "submitButton": "Create Profile",
    "nextStep": "Next: Add Contacts",
    "contactsTitle": "Build Your Circle",
    "contactsSubtitle": "Import trusted contacts from your device to share your flow with.",
    "importDescription": "We can quickly import names and numbers from your address book.",
    "importButton": "Import from Device",
    "importNotSupported": "Contact import is not supported on this device/browser.",
    "manualEntryNote": "This device doesn't support automatic import. You can add contacts manually later via the 'Connection Circle' tab.",
    "contactsSelected": "{{count}} contacts selected!",
    "finishWithContacts": "Finish & Save Contacts",
    "skipContacts": "Skip for Now"
  }
};
