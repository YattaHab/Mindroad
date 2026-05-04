import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState } from "react";
import UserSidebar from "./UserSidebar";
import { isLoggedIn, getCurrentUser } from "../services/authService";

export default function Navbar({ user: userProp }) {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const loggedIn = isLoggedIn();
  const user = userProp || getCurrentUser();

  const navLinks = [
    { to: "/tracks", label: "Tracks" },
    { to: "/pricing", label: "Pricing" },
    { to: "/about", label: "About" },
  ];

  return (
    <>
      <nav className="flex items-center justify-between px-10 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1">
          <img src={logo} alt="logo" className="w-8 h-8" />
          <div>
            <span className="text-white font-bold text-xl">Mind</span>
            <span className="text-secondary font-bold text-xl">Road</span>
          </div>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-medium py-2 px-4 rounded-xl transition duration-200 ${
                location.pathname === link.to
                  ? "text-secondary bg-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        {loggedIn ? (
          <div className="relative">
            <button
              className="flex items-center gap-3"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-white font-medium text-sm">
                {user?.name}
              </span>
            </button>
            {showDropdown && (
              <UserSidebar user={user} onClose={() => setShowDropdown(false)} />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/signin"
              className="font-medium text-gray-400 hover:text-white transition duration-300"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-white font-medium bg-primary px-4 py-2 rounded-xl hover:opacity-90 transition duration-300"
            >
              Get Started →
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
