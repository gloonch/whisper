import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { relationshipsApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useGlobalToast } from "../context/ToastContext";

export default function PartnerInviteBox() {
  const { user: authUser } = useAuth();
  const currentUser = authUser?.user || authUser || {};

  const [inviteState, setInviteState] = useState({
    inviteCode: null,
    partnerId: null,
    joined: false,
    partnerName: null,
  });
  
  const [inputCode, setInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Global Toast hook
  const { showSuccess, showError, showInfo } = useGlobalToast();

  const showToastMessage = (message, type = 'success') => {
    if (message.includes('Failed') || message.includes('error')) {
      showError("Partnership", message);
    } else if (message.includes('copied') || message.includes('generated')) {
      showInfo("Partnership", message);
    } else {
      showSuccess("Partnership", message);
    }
  };

  // Fetch current relationship on mount
  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        const rel = await relationshipsApi.getCurrent();
        const partners = rel?.partners || [];
        const partner = partners.find(p => p.userId !== currentUser?.id) || partners[0];
        
        console.log(rel)
        setInviteState({
          inviteCode: rel?.inviteCode || null,
          partnerId: partner?.userId || null,
          joined: !!rel?.id,
          partnerName: partner?.name || partner?.username || null,
        });
        if (rel?.inviteCode) setInputCode(rel.inviteCode);
      } catch (_) {
        // no active relationship; keep default state
        setInviteState({ inviteCode: null, partnerId: null, joined: false, partnerName: null });
      }
    };
    fetchCurrent();
  }, []);

  const refreshCurrent = async () => {
    try {
      const rel = await relationshipsApi.getCurrent();
      const partners = rel?.partners || [];
      const partner = partners.find(p => p.userId !== currentUser?.id) || partners[0];
      setInviteState({
        inviteCode: rel?.inviteCode || null,
        partnerId: partner?.userId || null,
        joined: !!rel?.id,
        partnerName: partner?.name || partner?.username || null,
      });
      if (rel?.inviteCode) setInputCode(rel.inviteCode);
    } catch (_) {
      setInviteState({ inviteCode: null, partnerId: null, joined: false, partnerName: null });
    }
  };

  // Generate invite code via API (requires firstMeetingDate)
  const generateInviteCode = async () => {
    setIsLoading(true);
    try {
      const firstMeetingDate = new Date().toISOString();
      const data = await relationshipsApi.generateInvite(firstMeetingDate);
      const code = data.inviteCode;
      setInviteState(prev => ({ ...prev, inviteCode: code, joined: false, partnerName: null }));
      setInputCode(code);
      showToastMessage(`Invite code generated! Share "${code}" with your partner 💌`);
    } catch (e) {
      showToastMessage(e?.response?.data?.message || 'Failed to generate invite');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy invite code to clipboard
  const handleCopy = async () => {
    const code = inviteState.inviteCode || inputCode;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      showToastMessage('Invite code copied to clipboard! 📋');
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToastMessage('Invite code copied! 📋');
    }
  };

  // Join with invite code via API
  const handleJoin = async () => {
    if (!inputCode.trim()) {
      showToastMessage('Please enter an invite code');
      return;
    }
    if (inputCode.length < 6) {
      showToastMessage('Invite code must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      await relationshipsApi.joinWithCode(inputCode.trim().toUpperCase());
      await refreshCurrent();
      const label = inviteState.partnerId ? `(${inviteState.partnerId.slice(0,6)}...)` : '';
      showToastMessage(`Connected with partner ${label} 🎉`);
      setInputCode("");
    } catch (e) {
      showToastMessage(e?.response?.data?.message || 'Failed to join with code');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete invite connection via API
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to disconnect from your partner? This will remove the shared timeline connection.')) {
      try {
        await relationshipsApi.disconnect();
        await refreshCurrent();
        setInputCode("");
        showToastMessage('Connection removed successfully');
      } catch (e) {
        showToastMessage(e?.response?.data?.message || 'Failed to disconnect');
      }
    }
  };

  return (
    <>
      <div className="bg-white/5 rounded-xl p-4 shadow-md shadow-white/5">
        <h3 className="text-lg font-semibold text-cream mb-4 flex items-center">
          Connection with partner
        </h3>

        <AnimatePresence mode="wait">
          {/* Generate / Join section: only when not joined */}
          {!inviteState.joined && (
            <motion.div
              key="not-joined"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3 mb-4"
            >
              <button
                onClick={generateInviteCode}
                disabled={isLoading}
                className="w-full bg-ruby-accent hover:bg-ruby-accent/80 disabled:bg-ruby-accent/50 text-white py-3 px-4 rounded-xl transition-colors font-medium flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Generating...
                  </>
                ) : (
                  'Generate Invite Code'
                )}
              </button>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="Invite code"
                  className="col-span-2 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder-white/40 focus:outline-none focus:border-ruby-accent transition-colors text-center font-mono tracking-wider"
                  maxLength={8}
                />
                <button onClick={handleCopy} className="w-full bg-white/10 hover:bg-white/20 text-cream rounded-xl">Copy</button>
              </div>
              <button
                onClick={handleJoin}
                disabled={isLoading || !inputCode.trim()}
                className="w-full bg-moody-purple hover:bg-moody-purple/80 disabled:bg-moody-purple/50 text-white py-3 px-4 rounded-xl transition-colors font-medium flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  'Join with Code'
                )}
              </button>
            </motion.div>
          )}

          {/* Connected state */}
          {inviteState.joined && (
            <motion.div
              key="joined"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Connection Status */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="text-cream font-medium mb-1">
                  Connected with: {inviteState.partnerName}
                </h4>
              </div>

              {/* Invite Code Display (optional) */}
              {inviteState.inviteCode && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-mist-blue mb-1">Invite Code</p>
                      <p className="text-lg font-mono tracking-wider text-cream font-bold">
                        {inviteState.inviteCode}
                      </p>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                      title="Copy code"
                    >
                      <svg className="w-5 h-5 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Delete Connection */}
              <button
                onClick={handleDelete}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 px-4 rounded-xl transition-colors font-medium text-sm"
              >
                Disconnect Partner
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


    </>
  );
} 