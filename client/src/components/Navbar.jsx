import { Link, useLocation } from "react-router-dom";

// Import PNG icons
import usIcon from "../images/navbar_us.png";
import whispersIcon from "../images/navbar_whispers.png";
import meIcon from "../images/navbar_me.png";

const tabs = [
  { to: "/", label: "Us", icon: usIcon },
  { to: "/whispers", label: "Whispers", icon: whispersIcon },
  { to: "/me", label: "Me", icon: meIcon },
];

function Navbar() {
  const location = useLocation();
  return (
    <nav className="w-full bg-white border-t border-gray-200 shadow-sm">
      <div className="flex justify-around items-center py-2.5 px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to;
          
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg
                ${isActive 
                  ? "scale-105" 
                  : "hover:scale-105"
                }
              `}
            >
              {/* آیکون PNG */}
              <img 
                src={tab.icon}
                alt={tab.label}
                className={`w-6 h-6 mb-1.5 transition-all duration-300 ${
                  isActive 
                    ? "opacity-100" 
                    : "opacity-60 hover:opacity-80"
                }`}
              />
              
              {/* متن زیر آیکون */}
              <span className={`text-xs font-medium transition-all duration-300 ${
                isActive 
                  ? "text-gray-900 font-semibold" 
                  : "text-gray-500 hover:text-gray-700"
              }`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;