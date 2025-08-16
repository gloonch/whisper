import React from "react";

export default function AlertDialog({ isOpen, title = "", message = "", actions = [], onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-5">
        <h3 className="text-lg font-semibold text-cream mb-2">{title}</h3>
        <p className="text-sm text-mist-blue mb-4 whitespace-pre-line">{message}</p>
        <div className="flex gap-2 justify-end">
          {actions.map((a, idx) => (
            <button
              key={idx}
              onClick={a.onClick}
              className={
                "px-4 py-2 rounded-lg text-sm " +
                (a.variant === "primary"
                  ? "bg-ruby-accent text-white hover:bg-ruby-accent/90"
                  : "bg-white/10 text-cream hover:bg-white/20")
              }
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
