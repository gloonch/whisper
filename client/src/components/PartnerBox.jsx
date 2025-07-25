import React from "react";

export default function PartnerBox({ 
  partner = { name: "Partner", avatar: null },
  firstMeetingDate = "2021-01-01" 
}) {
  // Calculate days between first meeting and today
  const calculateDaysTogether = () => {
    const startDate = new Date(firstMeetingDate);
    const today = new Date();
    const timeDifference = today.getTime() - startDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysDifference > 0 ? daysDifference : 0;
  };

  const daysCount = calculateDaysTogether();

  return (
    <div className="bg-white/5 rounded-xl p-4 shadow-md shadow-white/5">
      <div className="flex items-center space-x-3">
        {/* Partner Avatar */}
        <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center flex-shrink-0">
          {partner.avatar ? (
            <img
              src={partner.avatar}
              alt={partner.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-lg text-white/60">
              {partner.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Days Info */}
        <div className="flex-1 min-w-0">
          <p className="text-base text-cream">
            With you for{" "}
            <span className="font-semibold text-dusty-pink">
              {daysCount.toLocaleString()}
            </span>{" "}
            days
          </p>
          <p className="text-sm text-mist-blue truncate">
            Since {new Date(firstMeetingDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Heart Icon */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-ruby-accent/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-ruby-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
} 