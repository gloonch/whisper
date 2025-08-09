import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileHeader from "../components/ProfileHeader";
import PartnerBox from "../components/PartnerBox";
import StatsRow from "../components/StatsRow";
import PartnerInviteBox from "../components/PartnerInviteBox";
import PrivacyBlock from "../components/PrivacyBlock";
import Toast from "../components/Toast";

function Me() {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();

  // Derive profile from authenticated user ({ token, user } or direct)
  const derivedProfile = authUser?.user || authUser || { name: "User", username: "user", avatar: null };

  // Local editable user profile state (initialized from auth)
  const [user, setUser] = useState({
    name: derivedProfile?.name || "User",
    username: derivedProfile?.username || "user",
    avatar: derivedProfile?.avatar || null,
  });

  // Partner connection state
  const [hasPartner, setHasPartner] = useState(false);
  const [partner] = useState({
    name: "Partner",
    avatar: null,
  });

  // Settings state
  const [autoPublic, setAutoPublic] = useState(false);
  
  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Stats counters should be zero until user has real events
  const [stats, setStats] = useState({
    memories: 0,
    whispers: 0,
    public: 0,
  });

  // Mock public events (keep local for now)
  const [publicEvents, setPublicEvents] = useState([]);

  // If auth user changes (login), sync profile UI
  useEffect(() => {
    setUser({
      name: derivedProfile?.name || "User",
      username: derivedProfile?.username || "user",
      avatar: derivedProfile?.avatar || null,
    });
  }, [derivedProfile?.name, derivedProfile?.username, derivedProfile?.avatar]);

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // Load only UI prefs from localStorage (not auth)
  useEffect(() => {
    const savedAutoPublic = localStorage.getItem("maha_auto_public");
    if (savedAutoPublic) {
      setAutoPublic(savedAutoPublic === "true");
    }
  }, []);

  // Save user data to localStorage (UI-only profile for demo editing)
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("maha_user", JSON.stringify(updatedUser));
    showToastMessage("Profile updated successfully!");
  };

  // Handle auto-public toggle
  const handleAutoPublicChange = (newValue) => {
    setAutoPublic(newValue);
    localStorage.setItem("maha_auto_public", newValue.toString());
    showToastMessage(newValue ? "Auto-public enabled for new events" : "Auto-public disabled");
  };

  // Handle event privacy change (local only)
  const handleEventPrivacyChange = (eventId, makePrivate) => {
    if (makePrivate) {
      setPublicEvents((prev) => prev.filter((event) => event.id !== eventId));
      setStats((prev) => ({ ...prev, public: Math.max(0, prev.public - 1) }));
    }
  };

  // Handle sign out via AuthContext and redirect
  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      // Clear UI-only keys
      localStorage.removeItem("whisper_user");
      localStorage.removeItem("maha_auto_public");

      // Auth logout
      logout();

      // Redirect to login
      navigate("/login", { replace: true });
    }
  };

  // Clear all local UI data (not auth)
  const handleClearData = () => {
    if (
      window.confirm(
        "This will delete ALL your data. This action cannot be undone. Are you sure?"
      )
    ) {
      localStorage.clear();
      setUser({ name: "User", username: "user", avatar: null });
      setAutoPublic(false);
      setPublicEvents([]);
      setStats({ memories: 0, whispers: 0, public: 0 });
      showToastMessage("All data cleared");
    }
  };

  // First meeting date logic: if no partner yet, days should be 0
  // Pass today's date so PartnerBox calculates 0 days
  const todayIso = new Date().toISOString().split("T")[0];
  const firstMeetingDate = hasPartner ? "2021-01-01" : todayIso;

  return (
    <div className="flex flex-col h-full bg-bg-deep overflow-y-auto">
      <div className="flex-1 p-4 space-y-8 pb-8">
        {/* Profile Header */}
        <ProfileHeader user={user} onUserUpdate={handleUserUpdate} />

        {/* Partner Box - days zero until a connection exists */}
        <PartnerBox partner={partner} firstMeetingDate={firstMeetingDate} />

        {/* Stats Row - all zeros until real events exist */}
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