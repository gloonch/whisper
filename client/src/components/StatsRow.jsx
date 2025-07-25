import React from "react";

export default function StatsRow({ 
  memoriesCount = 0, 
  whispersCount = 0, 
  publicCount = 0 
}) {
  const stats = [
    {
      label: "Memories",
      value: memoriesCount,
      color: "text-dusty-pink"
    },
    {
      label: "Whispers", 
      value: whispersCount,
      color: "text-ruby-accent"
    },
    {
      label: "Public",
      value: publicCount,
      color: "text-moody-purple"
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="bg-white/5 rounded-xl p-4 shadow-md shadow-white/5 text-center"
        >
          {/* Large Number */}
          <div className={`text-2xl font-bold ${stat.color} mb-1`}>
            {stat.value.toLocaleString()}
          </div>
          
          {/* Label */}
          <div className="text-xs text-mist-blue font-medium">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
} 