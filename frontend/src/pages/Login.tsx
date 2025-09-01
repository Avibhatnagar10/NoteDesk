"use client";

import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import "../index.css";

// Password Input Component
const PasswordInput = ({
  name,
  value,
  onChange,
  placeholder,
  showPassword,
  setShowPassword,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 pr-10 bg-[#1C1C24] text-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        <EyeSlashIcon className="w-5 h-5" />
      ) : (
        <EyeIcon className="w-5 h-5" />
      )}
    </button>
  </div>
);

const LoadingIndicator = () => (
  <div className="fixed top-4 right-4 bg-gray-900 bg-opacity-80 text-white p-4 rounded-lg shadow-2xl flex items-center space-x-3 z-50 animate-pulse">
    <svg
      className="animate-spin h-5 w-5 text-indigo-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <div className="text-sm">
      <p className="font-semibold">Please wait...</p>
      <p className="text-gray-300">Our servers are waking up!</p>
    </div>
  </div>
);

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    if (activeTab === "signup") {
      if (!/^[a-zA-Z0-9]{3,}$/.test(formData.username)) {
        newErrors.username = "Username must be 3+ chars, no special symbols.";
        valid = false;
      }
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Invalid email format.";
        valid = false;
      }
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
          formData.password
        )
      ) {
        newErrors.password =
          "Password must be 6+ chars, with upper, lower, number & symbol.";
        valid = false;
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
        valid = false;
      }
    } else {
      if (!formData.username) {
        newErrors.username = "Username or Email is required.";
        valid = false;
      }
      if (!formData.password) {
        newErrors.password = "Password is required.";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

 const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;
 setIsLoading(true);
  try {
    const res = await fetch("https://notedesk-backend.onrender.com/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      // alert("Signup successful! Please login.");
      // reset form and switch to login tab
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
      setActiveTab("login");
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (err) {
    console.error(err);
    alert("Server error. Please try again later.");
  }
};

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
 setIsLoading(true);
    try {
      const res = await fetch("https://notedesk-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.username, // can be email or username
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save JWT in localStorage
        localStorage.setItem("token", data.token);

        // redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    }
  };

  const formContent =
    activeTab === "login" ? (
      <form className="space-y-6" onSubmit={handleLogin}>
        <div className="space-y-2">
          <input
            type="text"
            name="username"
            placeholder="Username or Email"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#1C1C24] text-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        <div className="space-y-2">
          <PasswordInput
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
        >
          Login
        </button>
        <div className="text-center text-gray-400 text-sm pt-4">
          New to Note<span className="text-indigo-400">Desk</span>?
          <button
            type="button"
            onClick={() => setActiveTab("signup")}
            className="text-indigo-400 hover:underline ml-1 font-medium"
          >
            Sign Up
          </button>
        </div>
      </form>
    ) : (
      <form className="space-y-5" onSubmit={handleSignup}>
        <div className="space-y-2">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#1C1C24] text-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        <div className="space-y-2">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#1C1C24] text-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <PasswordInput
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <PasswordInput
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
        >
          Sign Up
        </button>
        <div className="text-center text-gray-400 text-sm pt-4">
          Already have an account?
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className="text-indigo-400 hover:underline ml-1 font-medium"
          >
            Log In
          </button>
        </div>
      </form>
    );

  return (
    <div className=" bg-gradient-to-br from-black to-gray-800    fixed inset-0 ">
      {isLoading && <LoadingIndicator />}
      <div className="relative min-h-screen flex items-center justify-center  text-white p-4">
        {/* Animated blurred blobs */}

        {/* 
      <div className="absolute inset-0 -z-10 overflow-hidden">
     
        <div className="absolute w-72 h-72 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob top-1/4 left-1/3"></div>
        <div className="absolute w-72 h-72 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 top-1/2 right-1/4"></div>
        <div className="absolute w-72 h-72 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 bottom-1/4 left-1/2"></div>
      </div> */}

        <div className="bg-[#1A1A24]/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-sm border border-gray-800">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-wide">
              Note<span className="text-indigo-400">Desk</span>
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Your secure notes, anywhere.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8 border-b border-gray-700">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 text-sm font-medium transition ${
                activeTab === "login"
                  ? "text-indigo-400 border-b-2 border-indigo-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2 text-sm font-medium transition ${
                activeTab === "signup"
                  ? "text-indigo-400 border-b-2 border-indigo-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          {formContent}
        </div>
      </div>
    </div>
  );
}

