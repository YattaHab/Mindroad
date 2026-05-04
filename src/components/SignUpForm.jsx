import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import api from "../services/api";
import { saveAuth } from "../services/authService";

const passwordRules = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
  {
    label: "One special character (!@#$...)",
    test: (p) => /[^a-zA-Z0-9]/.test(p),
  },
];

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [passwordTouced, setPasswordTouched] = useState(false);

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleRegister = async () => {
    setErrors({});
    const Errors = {};

    if (!fullName) Errors.fullName = "Full name is required";
    else if (fullName.length < 3)
      Errors.fullName = "Fullname must be at least 3 charachters";
    if (!userName) Errors.userName = "Username is required";
    else if (userName.length < 3)
      Errors.userName = "Username must be at least 3 charachters";
    if (!email) Errors.email = "Email is required";

    if (!password) Errors.password = "Password is required";
    else if (!passwordRules.every((r) => r.test(password)))
      Errors.password = "Password does not meet all requirments";

    if (!confirmPassword)
      Errors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword)
      Errors.confirmPassword = "Passwords do not match";

    if (!agree) Errors.agree = "You must agree to the terms";

    if (Object.keys(Errors).length > 0) {
      setErrors(Errors);
      return;
    }

    try {
      const res = await api.post("/api/Account/register", {
        fullName,
        userName,
        email,
        password,
        confirmPassword,
      });

      const data = res.data;

      const token = data?.token || data?.jwtToken;

      if (token) {
        saveAuth(token, {
          email,
          name: fullName,
          image: null,
        });
        navigate("/");
      } else {
        navigate("/signin", {
          state: { message: "Registration successful! Please sign in." },
        });
      }
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || "Registration failed",
      });
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
        {errors.fullName && (
          <p className="text-red-500 text-sm mb-2">{errors.fullName}</p>
        )}
      </div>

      {/* username */}
      <div className="mb-3">
        <label htmlFor="username" className="block font-semibold mb-1">
          Username
        </label>
        <div className="flex items-center border rounded-xl px-3 py-2 gap-2">
          <User size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="johndoe123"
            id="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="outline-none"
          />
        </div>
        {errors.userName && (
          <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
        )}
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
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email}</p>
        )}
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
              placeholder="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
              className="outline-none"
            />
          </div>

          <button onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={16} className="text-gray-400" />
            ) : (
              <Eye size={16} className="text-gray-400" />
            )}
          </button>
        </div>
        {(passwordTouced || errors.password) && (
          <ul className="mt-2 flex flex-col gap-1">
            {passwordRules.map((rule) => {
              const passed = rule.test(password);
              return (
                <li
                  key={rule.label}
                  className={`text-xs flex items-center gap-1.5 ${passed ? "text-green-600" : "text-red-500"}`}
                >
                  <span>{passed ? "✓" : "✗"}</span>
                  {rule.label}
                </li>
              );
            })}
          </ul>
        )}
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
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-2">{errors.confirmPassword}</p>
        )}
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
      {errors.agree && (
        <p className="text-red-500 text-sm mb-2">{errors.agree}</p>
      )}
      {/* btn */}
      {errors.general && (
        <p className="text-red-500 text-sm mb-2">{errors.general}</p>
      )}
      <button
        onClick={handleRegister}
        className="mb-3 bg-primary text-white py-2.5 rounded-xl w-full"
      >
        Continue →
      </button>
    </div>
  );
}
