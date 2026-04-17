import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar({ isLoggedIn = false, user = null }) {
  const location = useLocation();

  return (
    <nav className="flex items-center justify-between px-10 py-4 ">
      {/* logo */}
      <Link to="/" className="flex items-center gap-1">
        <img src={logo} alt="logo" className="w-8 h-8" />
        <div>
          <span className="text-white font-bold text-xl">Mind</span>
          <span className="text-secondary font-bold text-xl">Road</span>
        </div>
      </Link>

      {/* nav links */}
      <div className="flex intems-center gap-8">
        <Link
          to="/tracks"
          className={` font-medium py-2 px-4 ${location.pathname === "/tracks" ? "text-secondary bg-white/10 rounded-xl" : "text-gray-400 hover:text-white transition duration-300"}`}
        >
          Tracks
        </Link>
        <Link
          to="/pricing"
          className={` font-medium py-2 px-4 ${location.pathname === "/pricing" ? "text-secondary bg-white/10 rounded-xl" : "text-gray-400 hover:text-white transition duration-300"}`}
        >
          Pricing
        </Link>
        <Link
          to="/about"
          className={` font-medium py-2 px-4 ${location.pathname === "/about" ? "text-secondary bg-white/10 rounded-xl" : "text-gray-400 hover:text-white transition duration-300"}`}
        >
          About
        </Link>
      </div>

      {/* right side  */}
      {isLoggedIn ? (
        <div className="flex items-center gap-3 cursor-pointer">
          <img src={user.image} alt="user" className="w-8 h-8 rounded-full" />
          <span className="text-white font-medium">{user?.name}</span>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            to="/signin"
            className=" font-medium text-gray-400 hover:text-white transition duration-300"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="text-white font-medium bg-primary px-4 py-2 rounded-xl hover:opacity-80 transition duration-300"
          >
            Sign Up →
          </Link>
        </div>
      )}
    </nav>
  );
}
