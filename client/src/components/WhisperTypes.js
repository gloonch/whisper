// Predefined Whisper Types
export const WHISPER_TYPES = {
  // Self Care
  DRINK_WATER: {
    id: "drink_water",
    label: "Drink Water",
    emoji: "💧",
    category: "self_care",
    canBecomeEvent: false,
    defaultFor: "self"
  },
  TAKE_BREAK: {
    id: "take_break",
    label: "Take a Break",
    emoji: "☕",
    category: "self_care", 
    canBecomeEvent: false,
    defaultFor: "self"
  },
  EXERCISE: {
    id: "exercise",
    label: "Do Some Exercise",
    emoji: "🏃‍♂️",
    category: "self_care",
    canBecomeEvent: true,
    defaultFor: "self"
  },
  
  // Partner Care
  HUG_PARTNER: {
    id: "hug_partner",
    label: "Hug Your Partner",
    emoji: "🤗",
    category: "partner_care",
    canBecomeEvent: true,
    defaultFor: "partner"
  },
  BE_KIND: {
    id: "be_kind", 
    label: "Be Extra Kind Today",
    emoji: "💌",
    category: "partner_care",
    canBecomeEvent: true,
    defaultFor: "partner"
  },
  SAY_I_LOVE_YOU: {
    id: "say_i_love_you",
    label: "Say 'I Love You'",
    emoji: "💕",
    category: "partner_care",
    canBecomeEvent: false,
    defaultFor: "partner"
  },
  LISTEN_ACTIVELY: {
    id: "listen_actively",
    label: "Listen Actively",
    emoji: "👂",
    category: "partner_care",
    canBecomeEvent: true,
    defaultFor: "partner"
  },

  // Shared Activities
  COOK_TOGETHER: {
    id: "cook_together",
    label: "Cook Something Together",
    emoji: "👨‍🍳",
    category: "shared",
    canBecomeEvent: true,
    defaultFor: "both"
  },
  WATCH_SUNSET: {
    id: "watch_sunset",
    label: "Watch the Sunset",
    emoji: "🌅",
    category: "shared",
    canBecomeEvent: true,
    defaultFor: "both"
  },
  SHARE_STORY: {
    id: "share_story",
    label: "Share a Story",
    emoji: "📖",
    category: "shared", 
    canBecomeEvent: true,
    defaultFor: "both"
  },

  // Custom
  CUSTOM: {
    id: "custom",
    label: "Custom Whisper",
    emoji: "✨",
    category: "custom",
    canBecomeEvent: true,
    defaultFor: "self"
  }
};

// Categories for grouping
export const WHISPER_CATEGORIES = {
  self_care: {
    label: "Self Care",
    color: "#7CE38B",
    icon: "🌱"
  },
  partner_care: {
    label: "Partner Care", 
    color: "#FF66A8",
    icon: "💕"
  },
  shared: {
    label: "Together",
    color: "#4DA8FF",
    icon: "👫"
  },
  custom: {
    label: "Custom",
    color: "#B588FF", 
    icon: "✨"
  }
};

// Recurrence options
export const RECURRENCE_OPTIONS = {
  ONCE: {
    id: "once",
    label: "Just Today",
    description: "One-time reminder for today only"
  },
  EVERYDAY: {
    id: "everyday", 
    label: "Every Day",
    description: "Daily reminder that repeats"
  }
};

// Target options
export const TARGET_OPTIONS = {
  SELF: {
    id: "self",
    label: "For Me",
    description: "Reminder for yourself"
  },
  PARTNER: {
    id: "partner",
    label: "For Partner", 
    description: "Reminder for your partner"
  },
  BOTH: {
    id: "both",
    label: "For Both",
    description: "Reminder for both of you"
  }
};

// Helper functions
export const getWhispersByCategory = (category) => {
  return Object.values(WHISPER_TYPES).filter(type => type.category === category);
};

export const getWhisperById = (id) => {
  return Object.values(WHISPER_TYPES).find(type => type.id === id);
};

export const createWhisperData = ({
  type,
  customText = "",
  customEmoji = "✨",
  target = "self",
  recurrence = "once",
  date = new Date().toISOString().split('T')[0]
}) => {
  const whisperType = getWhisperById(type) || WHISPER_TYPES.CUSTOM;
  
  return {
    id: `whisper_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date,
    text: type === "custom" ? customText : whisperType.label,
    type: whisperType.id,
    emoji: type === "custom" ? customEmoji : whisperType.emoji,
    for: target,
    recurrence,
    canBecomeEvent: whisperType.canBecomeEvent,
    isDone: false,
    createdAt: new Date().toISOString()
  };
}; 