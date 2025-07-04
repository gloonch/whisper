import { Link, useLocation } from "react-router-dom";

const tabs = [
  { to: "/", label: "Us", icon: "❤️" },
  { to: "/whispers", label: "Whispers", icon: "🌬️" },
  { to: "/dates", label: "Dates", icon: "📅" },
  { to: "/me", label: "Me", icon: "👤" },
];

function Navbar() {
  const location = useLocation();
  return (
    <nav className="w-full bg-dusty-pink flex justify-around py-2 border-t-2 border-ruby-accent z-50 shadow-lg">
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          className={`flex flex-col items-center text-sm font-medium transition-colors duration-200 px-2 py-1 rounded-xl
            ${location.pathname === tab.to ? "app-accent bg-bg-deep/20" : "text-bg-deep hover:text-ruby-accent hover:bg-bg-deep/10"}
          `}
        >
          <span className="text-2xl mb-1">{tab.icon}</span>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

export default Navbar;