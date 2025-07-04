import React from "react";

function MobileContainer({ children }) {
  return (
    <div
      className="w-[400px] h-screen bg-dusty-pink rounded-3xl shadow-2xl mx-auto flex flex-col overflow-hidden border-2 border-ruby-accent"
      style={{
        minWidth: "400px",
        maxWidth: "400px",
        height: "100vh",
        minHeight: "100vh",
        maxHeight: "100vh"
      }}
    >
      {children}
    </div>
  );
}

export default MobileContainer; 