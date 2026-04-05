// JEEWAN Platform Constants

export const COLORS = {
  calm: '#1D6FA5',      // Crisis/calming blue
  nature: '#1D9E75',    // Success/pledge green
  warn: '#E85D24',      // SOS/danger coral
  surface: '#F4F8FC',   // Light background
};

export const DAST_10_THRESHOLD = {
  LOW: 6,      // Score <= 6
  MODERATE: 3, // Score 3-6
  HIGH: 7,     // Score > 6
};

export const RISK_LEVELS = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
};

export const USER_ROLES = {
  GUEST: 'guest',
  USER: 'user',
  COUNSELLOR: 'counsellor',
  VOLUNTEER: 'volunteer',
  ADMIN: 'admin',
};

export const BADGE_REWARDS = {
  FIRST_QUIZ: { points: 50, icon: '🎯' },
  SEVEN_DAY_STREAK: { points: 200, icon: '🔥' },
  CHAT_CHAMPION: { points: 150, icon: '💬' },
  SUPPORT_SEEKER: { points: 100, icon: '🏥' },
  STORY_READER: { points: 75, icon: '📚' },
  RECOVERY_STAR: { points: 300, icon: '🌟' },
};

export const MESSAGES = {
  EN: {
    SOS_BUTTON: 'EMERGENCY SOS',
    QUIZ_START: 'Start DAST-10 Assessment',
    CHAT_NOW: 'Chat with Counsellor',
    FIND_REHAB: 'Find Rehab Centers',
    READ_STORIES: 'Read Survivor Stories',
  },
  TE: {
    SOS_BUTTON: 'అత్యవసర ఎస్‌ఓ‌ఎస్',
    QUIZ_START: 'DAST-10 మూల్యాంకనం ప్రారంభించండి',
    CHAT_NOW: 'సలహాదారుడితో చాట్ చేయండి',
    FIND_REHAB: 'రిహాబ్ సెంటర్‌లను కనుగొనండి',
    READ_STORIES: 'సర్వైవర్ స్టోరీలను చదవండి',
  },
  HI: {
    SOS_BUTTON: 'आपातकालीन एसओएस',
    QUIZ_START: 'DAST-10 मूल्यांकन शुरू करें',
    CHAT_NOW: 'परामर्शदाता के साथ चैट करें',
    FIND_REHAB: 'पुनर्वास केंद्र खोजें',
    READ_STORIES: 'सर्वाइवर स्टोरीज पढ़ें',
  },
};
