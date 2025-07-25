// Predefined Whisper Types
export const WHISPER_TYPES = {
  // Shared Activities
  COOK_TOGETHER: {
    id: "cook_together",
    label: "Cook Something Together",
    emoji: "👨‍🍳",
    category: "shared",
    canBecomeEvent: true
  },
  WATCH_SUNSET: {
    id: "watch_sunset",
    label: "Watch the Sunset",
    emoji: "🌅",
    category: "shared",
    canBecomeEvent: true
  },
  SHARE_STORY: {
    id: "share_story",
    label: "Share a Story",
    emoji: "📖",
    category: "shared", 
    canBecomeEvent: true
  },
  PLAY_GAME: {
    id: "play_game",
    label: "Play a Game Together",
    emoji: "🎲",
    category: "shared",
    canBecomeEvent: true
  },
  TAKE_WALK: {
    id: "take_walk",
    label: "Take a Walk Together",
    emoji: "🚶‍♂️🚶‍♀️",
    category: "shared",
    canBecomeEvent: true
  },
  WATCH_MOVIE: {
    id: "watch_movie",
    label: "Watch a Movie",
    emoji: "🎬",
    category: "shared",
    canBecomeEvent: true
  },

  // Custom
  CUSTOM: {
    id: "custom",
    label: "Custom Whisper",
    emoji: "✨",
    category: "custom",
    canBecomeEvent: true
  }
};

// Categories for grouping
export const WHISPER_CATEGORIES = {
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
  recurrence = "once",
  date = new Date().toISOString().split('T')[0]
}) => {
  const whisperType = getWhisperById(type) || WHISPER_TYPES.CUSTOM;
  
  return {
    id: `whisper_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date,
    text: type === "custom" ? customText : whisperType.label,
    type: whisperType.id,
    emoji: whisperType.emoji, // همیشه emoji از whisperType استفاده می‌شود
    recurrence,
    canBecomeEvent: whisperType.canBecomeEvent,
    isDone: false,
    createdAt: new Date().toISOString()
  };
}; 