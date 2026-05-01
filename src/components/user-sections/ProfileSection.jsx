import { useState } from "react";
import { Camera, Check } from "lucide-react";
import Card from "./Card";
import api from "../../services/api";

export default function ProfileSection({ user }) {
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      await api.put("/api/Account/profile", { name, bio });
    } catch {
      //nothing for now
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Public Profile</h2>
        <p className="text-gray-500 text-sm mt-1">
          Add information about yourself
        </p>
      </div>

      {/* avatar */}
      <Card>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold select-none">
            {(user?.name || "u")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <p className="text-primary text-xs mt-1 cursor-pointer hover:underline">
              Change photo
            </p>
          </div>
        </div>
      </Card>

      {/* basics */}
      <Card>
        <h3 className="font-semibold text-gray-800 mb-4">Basics</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell us about yourself..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={true}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition ${
              saved
                ? "bg-green-500 text-white"
                : "bg-primary text-white hover:opacity-90"
            }`}
          >
            {saved ? (
              <>
                <Check size={16} /> Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </Card>
    </div>
  );
}
