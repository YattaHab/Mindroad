import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="">
      {/* heading */}
      <h1 className="text-3xl font-bold mb-2">Sign in</h1>
      <p className="text-gray-500 mb-5">
        New to Code Journey?{" "}
        <Link to="/signup" className="text-primary font-medium">
          Create a free account
        </Link>
      </p>

      {/* divider */}
      <div className="flex items-center gap-3 mb-5">
        <hr className="flex-1" />
        <span className="text-gray-400 text-sm">or continue with email</span>
        <hr className="flex-1" />
      </div>

      {/* email */}
      <div className="mb-5">
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
      <div className="mb-5">
        <div className="flex justify-between mb-1">
          <label htmlFor="email" className="block font-semibold mb-1">
            Password
          </label>
          <Link to="forgot-password" className="text-primary">
            Forgot password?
          </Link>
        </div>
        <div className="flex items-center border rounded-xl px-3 py-2 justify-between">
          <div className="flex gap-2">
            <Lock size={16} className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
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

      {/* remember me */}
      <div className="flex items-center gap-2 mb-5">
        <input type="checkbox" id="remember" />
        <label htmlFor="remember" className="text-gray-500">
          Remember me for 30 days
        </label>
      </div>

      {/* sign in btn */}
      <button className="mb-5 bg-primary text-white py-2.5 rounded-xl w-full">
        Sign in →
      </button>

      {/* terms */}
      <p
        className="text-center text-xs text-gray-400"
        style={{ fontSize: "0.7rem" }}
      >
        By signing in you agree to our{" "}
        <span className="underline cursor-pointer text-gray-500">Terms</span>{" "}
        and{" "}
        <span className="underline cursor-pointer text-gray-500">
          Privacy Policy
        </span>
      </p>
    </div>
  );
}
