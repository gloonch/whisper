import React, { useState, useEffect } from "react";
import ProfileHeader from "../components/ProfileHeader";
import PartnerBox from "../components/PartnerBox";
import StatsRow from "../components/StatsRow";
import PartnerInviteBox from "../components/PartnerInviteBox";
import PrivacyBlock from "../components/PrivacyBlock";
import Toast from "../components/Toast";

function Me() {
  // User state
  const [user, setUser] = useState({
    name: "Mahdi",
    username: "gloonch",
    avatar: null
  });

  // Partner state
  const [partner] = useState({
    name: "Partner",
    avatar: null
  });

  // Settings state
  const [autoPublic, setAutoPublic] = useState(false);
  
  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Mock data for stats (in real app, this would come from context/props)
  const [stats, setStats] = useState({
    memories: 42,
    whispers: 28,
    public: 12
  });

  // Mock public events (in real app, this would come from context/props)
  const [publicEvents, setPublicEvents] = useState([
    {
      id: "1",
      title: "Beach Trip",
      date: "2023-07-15",
      imageUrl: "",
      isPublic: true
    },
    {
      id: "2", 
      title: "Anniversary Dinner",
      date: "2023-12-25",
      imageUrl: "",
      isPublic: true
    }
  ]);

  // First meeting date (in real app, this would come from events)
  const firstMeetingDate = "2021-01-01";

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // Load user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('maha_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }

    const savedAutoPublic = localStorage.getItem('maha_auto_public');
    if (savedAutoPublic) {
      setAutoPublic(savedAutoPublic === 'true');
    }
  }, []);

  // Save user data to localStorage
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('maha_user', JSON.stringify(updatedUser));
    showToastMessage('Profile updated successfully!');
  };

  // Handle auto-public toggle
  const handleAutoPublicChange = (newValue) => {
    setAutoPublic(newValue);
    localStorage.setItem('maha_auto_public', newValue.toString());
    showToastMessage(
      newValue 
        ? 'Auto-public enabled for new events' 
        : 'Auto-public disabled'
    );
  };

  // Handle event privacy change
  const handleEventPrivacyChange = (eventId, makePrivate) => {
    if (makePrivate) {
      // Remove from public events
      setPublicEvents(prev => prev.filter(event => event.id !== eventId));
      setStats(prev => ({ ...prev, public: prev.public - 1 }));
    }
    // In real app, this would also update the main events array
  };

  // Handle sign out
  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      // Clear user data but keep events
      localStorage.removeItem('maha_user');
      localStorage.removeItem('maha_auto_public');
      showToastMessage('Signed out successfully');
      
      // Reset user to default
      setUser({
        name: "User",
        username: "user", 
        avatar: null
      });
      setAutoPublic(false);
    }
  };

  // Handle clear data
  const handleClearData = () => {
    if (window.confirm('This will delete ALL your data. This action cannot be undone. Are you sure?')) {
      // Clear all localStorage data
      localStorage.clear();
      
      // Reset all state
      setUser({
        name: "User",
        username: "user",
        avatar: null
      });
      setAutoPublic(false);
      setPublicEvents([]);
      setStats({
        memories: 0,
        whispers: 0,
        public: 0
      });
      
      showToastMessage('All data cleared');
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg-deep overflow-y-auto">
      <div className="flex-1 p-4 space-y-8 pb-8">
        {/* Profile Header */}
        <ProfileHeader 
          user={user}
          onUserUpdate={handleUserUpdate}
        />

        {/* Partner Box */}
        <PartnerBox 
          partner={partner}
          firstMeetingDate={firstMeetingDate}
        />

        {/* Stats Row */}
        <StatsRow 
          memoriesCount={stats.memories}
          whispersCount={stats.whispers}
          publicCount={stats.public}
        />

        {/* Partner Invite System */}
        <PartnerInviteBox />

        {/* Privacy & Settings */}
        <PrivacyBlock 
          autoPublic={autoPublic}
          onAutoPublicChange={handleAutoPublicChange}
          publicEvents={publicEvents}
          onEventPrivacyChange={handleEventPrivacyChange}
          onSignOut={handleSignOut}
          onClearData={handleClearData}
        />
      </div>

      {/* Toast */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default Me; 