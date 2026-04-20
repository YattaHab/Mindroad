import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import api from "../services/api";
import { saveAuth } from "../services/authService";
export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const navigate = useNavigate();
  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!agree) {
      alert("You must agree to the terms");
      return;
    }

    try {
      const res = await api.post("/api/Account/register", {
        name: fullName,
        email,
        password,
        confirmPassword,
      });

      const data = res.data;
      console.log("REGISTER RESPONSE:", data);

      const token = data.token || data.jwtToken;

      // If backend logs user in immediately
      if (token) {
        saveAuth(token, {
          email,
          name: fullName,
          image: null,
        });

        // ADD THESE 3 LINES:
        console.log("🔥 SAVED TO LOCALSTORAGE:");
        console.log("Token key:", localStorage.getItem("authToken"));
        console.log("User key:", localStorage.getItem("authUser"));
        alert("Check console - what keys?");

        alert("Account created & logged in!");
        navigate("/");
      } else {
        // Most likely case
        alert("Account created! Please sign in.");
        navigate("/signin");
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      {/* heading */}
      <h1 className="text-3xl font-bold mb-1">Create your account</h1>
      <p className="text-gray-500 mb-5">
        Already a member?{" "}
        <Link to="/signin" className="text-primary font-medium">
          Sign in
        </Link>
      </p>

      {/*user name */}
      <div className="mb-3">
        <label htmlFor="fullname" className="block font-semibold mb-1">
          Full name
        </label>
        <div className="flex items-center border rounded-xl px-3 py-2 gap-2">
          <User size={16} className="text-gray-400 " />

          <input
            type="text"
            placeholder="JohnDoe"
            id="fullname"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="outline-none"
          />
        </div>
      </div>

      {/* email */}
      <div className="mb-3">
        <label htmlFor="email" className="block font-semibold mb-1">
          Email address
        </label>
        <div className="flex items-center border rounded-xl px-3 py-2 gap-2">
          <Mail size={16} className="text-gray-400 " />

          <input
            type="email"
            placeholder="you@example.com"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="outline-none"
          />
        </div>
      </div>
      {/* pass */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <label htmlFor="password" className="block font-semibold mb-1">
            Password
          </label>
        </div>
        <div className="flex items-center border rounded-xl px-3 py-2 justify-between">
          <div className="flex gap-2">
            <Lock size={16} className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min.6 characters"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="outline-none"
            />
          </div>
          <button onClick={() => setShowPassword(!showPassword)} className="">
            {showPassword ? (
              <EyeOff size={16} className="text-gray-400" />
            ) : (
              <Eye size={16} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>
      {/* confirm pass */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <label htmlFor="password" className="block font-semibold mb-1">
            Confirm password
          </label>
        </div>
        <div className="flex items-center border rounded-xl px-3 py-2 justify-between">
          <div className="flex gap-2">
            <Lock size={16} className="text-gray-400" />
            <input
              type="password"
              placeholder="Confirm password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="outline-none"
            />
          </div>
        </div>
      </div>
      {/* terms */}
      <div
        className="flex items-center gap-2 mb-3"
        style={{ fontSize: "0.7rem" }}
      >
        <input
          type="checkbox"
          id="terms"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
        />
        <label htmlFor="terms" className="text-gray-500">
          I agree to the{" "}
          <span className="underline cursor-pointer text-primary">Terms</span>{" "}
          and{" "}
          <span className="underline cursor-pointer text-primary">
            Privacy Policy
          </span>
        </label>
      </div>
      {/* btn */}
      <button
        onClick={handleRegister}
        className="mb-3 bg-primary text-white py-2.5 rounded-xl w-full"
      >
        Continue →
      </button>
    </div>
  );
}
