import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCurrentUser, isLoggedIn } from "../services/authService";

import UserSB from "../components/user-sections/UserSB";
import ProfileSection from "../components/user-sections/ProfileSection";
import BookmarksSection from "../components/user-sections/BookmarksSection";
import LearningsSection from "../components/user-sections/LearningsSection";
import NotificationsSection from "../components/user-sections/NotificationsSection";
import SettingsSection from "../components/user-sections/SettingsSection";
import SubscriptionsSection from "../components/user-sections/SubscriptionsSection";

const valid_sec = [
  "profile",
  "bookmarks",
  "learnings",
  "notifications",
  "settings",
  "subscriptions",
];

function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const loggedIn = isLoggedIn();
  const user = getCurrentUser();

  //derive active sec from #url
  const hashSection = location.hash.replace("#", "");
  const [active, setActive] = useState(
    valid_sec.includes(hashSection) ? hashSection : "profile",
  );

  useEffect(() => {
    if (!loggedIn) navigate("/signin");
  }, [loggedIn, navigate]);

  //sync active section
  useEffect(() => {
    const section = location.hash.replace("#", "");
    if (valid_sec.includes(section)) {
      setActive(section);
    }
  }, [location.hash]);

  const handleNav = (id) => {
    setActive(id);
    navigate(`/user#${id}`);
  };

  const renderSection = () => {
    switch (active) {
      case "profile":
        return <ProfileSection user={user} />;
      case "bookmarks":
        return <BookmarksSection />;
      case "learnings":
        return <LearningsSection />;
      case "notifications":
        return <NotificationsSection />;
      case "settings":
        return <SettingsSection user={user} />;
      case "subscriptions":
        return <SubscriptionsSection />;
      default:
        return <ProfileSection user={user} />;
    }
  };

  if (!loggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#030712]">
        <Navbar />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 flex gap-8">
        <UserSB user={user} active={active} onNav={handleNav} />
        <main className="flex-1 min-w-0">{renderSection()}</main>
      </div>
    </div>
  );
}
export default ProfilePage;
