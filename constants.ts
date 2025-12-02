import type { Contact, NulFlowEntry } from './types';

// These are now translation keys. The UI will translate them.
export const INITIAL_MOODS: string[] = [
  'stressed',
  'overwhelmed',
  'calm',
  'energized',
  'tired',
  'anxious',
  'peaceful',
  'focused',
];

export const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Johan',
    email: 'dennie@ddsoft.be',
    group: 'Family',
    permissions: {
      canRequestState: false,
      canSeeBucketLevel: true,
      canSeeBatteryLevel: true,
      canSeePrivateNotes: false,
    },
  },
  {
    id: '2',
    name: 'Arno',
    phone: '+32492621064',
    group: 'Family',
    permissions: {
      canRequestState: true,
      canSeeBucketLevel: false,
      canSeeBatteryLevel: true,
      canSeePrivateNotes: false,
    },
  },
  {
    id: '3',
    name: 'Mario',
    group: 'Friend',
    email: 'mario@example.com',
    permissions: {
      canRequestState: true,
      canSeeBucketLevel: true,
      canSeeBatteryLevel: true,
      canSeePrivateNotes: true,
    },
  },
    {
    id: '4',
    name: 'Dr. Sarah Thompson',
    group: 'Therapist',
    email: 'sarah.t@health.org',
    permissions: {
      canRequestState: true,
      canSeeBucketLevel: true,
      canSeeBatteryLevel: true,
      canSeePrivateNotes: true,
    },
  },
    {
    id: '5',
    name: 'Alex Chen',
    group: 'Partner',
    email: 'alex.c@example.com',
    permissions: {
      canRequestState: true,
      canSeeBucketLevel: true,
      canSeeBatteryLevel: true,
      canSeePrivateNotes: true,
    },
  },
];

export const MOCK_HISTORY: NulFlowEntry[] = [
    {
        id: 'hist_1',
        timestamp: new Date('2025-11-04T14:52:00'),
        bucketLevel: 70,
        batteryLevel: 34,
        moods: ['tired', 'stressed'],
        notes: 'Long day at work, feeling pretty drained.',
        sharedWith: ['5']
    },
    {
        id: 'hist_2',
        timestamp: new Date('2025-10-28T19:42:00'),
        bucketLevel: 25,
        batteryLevel: 85,
        moods: ['calm', 'relaxed'],
        notes: 'Good day',
    },
    {
        id: 'hist_3',
        timestamp: new Date('2025-10-25T10:15:00'),
        bucketLevel: 50,
        batteryLevel: 60,
        moods: ['focused'],
        notes: 'Productive morning session.',
        sharedWith: ['4']
    }
];