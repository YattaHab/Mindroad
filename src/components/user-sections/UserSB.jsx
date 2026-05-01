import {
  User,
  Bookmark,
  BookOpen,
  Bell,
  Settings,
  CreditCard,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { id: "learnings", label: "My Learnings", icon: BookOpen },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
];

export default function UserSB({ user, active, onNav }) {
  return (
    <aside className="w-64 flex-shrink-0">
      {/* user card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg select-none flex-shrink-0">
            {(user?.name || "U")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">
              {user?.name}
            </p>
            <p className="text-gray-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* nav */}
      <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {NAV_ITEMS.map((item, i) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium transition group
                ${i < NAV_ITEMS.length - 1 ? "border-b border-gray-50" : ""}
                ${
                  isActive
                    ? "bg-primary/5 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={17}
                  className={
                    isActive
                      ? "text-primary"
                      : "text-gray-400 group-hover:text-gray-600"
                  }
                />
                {item.label}
              </div>
              {isActive && <ChevronRight size={14} className="text-primary" />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
