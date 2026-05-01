import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Check,
  Shield,
  LogOut,
} from "lucide-react";
import Card from "./Card";
import api from "../../services/api";
import { clearAuth } from "../../services/authService";

export default function SettingsSection({ user }) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPwError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPwError("Password must be at least 6 characters");
      return;
    }
    setPwError("");
    try {
      await api.post("/api/Account/reset-password", {
        currentPassword,
        newPassword,
      });
      setPwSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwSaved(false), 2000);
    } catch (err) {
      setPwError(err.response?.data?.message || "Failed to update password");
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/signin");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage your account preferences
        </p>
      </div>

      {/* account info */}
      <Card>
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Mail size={16} className="text-primary" /> Account
        </h3>
        <div className="flex items-center justify-between py-3 border-b border-gray-50">
          <div>
            <p className="text-sm font-medium text-gray-700">Email address</p>
            <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Username</p>
            <p className="text-sm text-gray-500 mt-0.5">{user?.name}</p>
          </div>
        </div>
      </Card>

      {/* change password */}
      <Card>
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Lock size={16} className="text-primary" /> Change Password
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-2.5 gap-2">
              <Lock size={14} className="text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="flex-1 outline-none text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-2.5 gap-2">
              <Lock size={14} className="text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 outline-none text-sm"
                placeholder="Min. 6 characters"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-2.5 gap-2">
              <Lock size={14} className="text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 outline-none text-sm"
                placeholder="Confirm password"
              />
            </div>
          </div>
          {pwError && <p className="text-red-500 text-xs">{pwError}</p>}
          <button
            onClick={handlePasswordChange}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition ${
              pwSaved
                ? "bg-green-500 text-white"
                : "bg-primary text-white hover:opacity-90"
            }`}
          >
            {pwSaved ? (
              <>
                <Check size={16} /> Updated!
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between py-3 border-b border-gray-50">
          <div>
            <p className="text-sm font-medium text-gray-700">Log out</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition font-medium"
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      </Card>
    </div>
  );
}
