import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);

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

      {/* email */}
      <div className="mb-3">
        <label htmlFor="fullname" className="block font-semibold mb-1">
          Full name
        </label>
        <div className="flex items-center border rounded-xl px-3 py-2 gap-2">
          <User size={16} className="text-gray-400 " />

          <input
            type="text"
            placeholder="John Doe"
            id="fullname"
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
            className="outline-none"
          />
        </div>
      </div>
      {/* pass */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <label htmlFor="email" className="block font-semibold mb-1">
            Password
          </label>
        </div>
        <div className="flex items-center border rounded-xl px-3 py-2 justify-between">
          <div className="flex gap-2">
            <Lock size={16} className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min.6 characters"
              id="email"
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
      {/* terms */}
      <div
        className="flex items-center gap-2 mb-3"
        style={{ fontSize: "0.7rem" }}
      >
        <input type="checkbox" id="remember" />
        <label htmlFor="remember" className="text-gray-500">
          I agree to the{" "}
          <span className="underline cursor-pointer text-primary">Terms</span>{" "}
          and{" "}
          <span className="underline cursor-pointer text-primary">
            Privacy Policy
          </span>
        </label>
      </div>
      {/* btn */}
      <button className="mb-3 bg-primary text-white py-2.5 rounded-xl w-full">
        Continue →
      </button>
    </div>
  );
}
