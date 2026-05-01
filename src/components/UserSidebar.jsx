import {
  Bell,
  Bookmark,
  BookOpen,
  CreditCard,
  LogOut,
  Settings,
  User,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { clearAuth } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function UserSidebar({ user, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    onClose();
    navigate("/signin", { replace: true });
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 z-20 " />
      {/* Panel */}
      <div className="fixed top-16 right-6 w-72 bg-white shadow-2xl z-40 flex flex-col rounded-xl">
        {/* close X*/}
        <div className="flex justify-end p-3">
          <button onClick={onClose}>
            <X size={20} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
        {/* header */}
        <div className="flex items-center justify-between p-5 border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={user?.image}
              alt={user?.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-bold">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
        {/* items */}
        <div className="flex flex-col p-4 gap-1 flex-1">
          <Link
            to="/user#profile"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition duration-200"
          >
            <User size={20} className="text-primary" />
            <span className="font-semibold">My Profile</span>
          </Link>
          <Link
            to="/user#bookmarks"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition duration-200"
          >
            <Bookmark size={20} className="text-primary" />
            <span className="font-semibold">Bookmarks</span>
          </Link>

          <Link
            to="/user#learnings"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition duration-200"
          >
            <BookOpen size={20} className="text-primary" />
            <span className="font-semibold">My Learnings</span>
          </Link>

          <Link
            to="/user#notification"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition duration-200"
          >
            <Bell size={20} className="text-primary" />
            <span className="font-semibold">Notifications</span>
          </Link>

          <Link
            to="/user#setting"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition duration-200"
          >
            <Settings size={20} className="text-primary" />
            <span className="font-semibold">Settings</span>
          </Link>
          <Link
            to="/user#subscriptions"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition duration-200"
          >
            <CreditCard size={20} className="text-primary" />
            <span className="font-semibold">Subscriptions</span>
          </Link>
        </div>
        {/* logout */}
        <div className="p-4 border-t border-gray-200 ">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLogout();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 transition duration-300 w-full"
          >
            <LogOut size={20} />
            <span className="font-semibold">Log Out</span>
          </button>
        </div>
        {/* - */}
      </div>
      {/* - */}
    </>
  );
}
