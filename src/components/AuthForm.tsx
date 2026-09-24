import React, { useState } from "react";
import type { LoginCredentials, SignupPayload } from "../types";

interface AuthFormProps {
  onLogin: (credentials: LoginCredentials) => void;
  onSignup: (payload: SignupPayload) => void;
  error?: string | null;
  onClearError?: () => void;
}

export function AuthForm({ onLogin, onSignup, error, onClearError }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      onSignup({ name, email, password });
    } else {
      onLogin({ email, password });
    }
  };

  const toggleAuthMode = (signUpState: boolean) => {
    setIsSignUp(signUpState);
    setShowPassword(false);
    if (onClearError) onClearError();
  };

  return (
    <div
      className="min-h-[82vh] w-full flex 
    items-center justify-center p-1 sm:p-1 lg:p-1"
    >
      <div
        className="w-full max-w-5xl bg-white rounded-3xl 
      shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[82vh]"
      >
        {/* LEFT COLUMN: Visual & Banner Section */}
        <div className="lg:col-span-7 bg-linear-to-br from-amber-400 via-orange-500 to-rose-500 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden text-white">
          <div
            className="absolute -top-16 -left-16 w-64 h-64 
          bg-white/10 rounded-full blur-2xl pointer-events-none"
          />
          <div
            className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-700/20 
          rounded-full blur-3xl pointer-events-none"
          />

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md grid place-items-center leading-none select-none">
              <span className="text-xl -translate-y-0.5">🐾</span>
            </div>
            <span
              className="font-extrabold tracking-wider text-sm 
            uppercase text-amber-100"
            >
              Pet Adopthub
            </span>
          </div>

          <div className="my-auto py-8 relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="w-full max-w-sm mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shadow-lg relative group">
              <div className="text-6xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                🐶 🐱 🐰
              </div>
              <p className="text-sm font-medium text-amber-50">
                Over{" "}
                <span className="font-bold text-white underline decoration-amber-300">
                  1,200+ rescue animals
                </span>{" "}
                found homes this month.
              </p>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Every pet deserves a loving family.
            </h1>
            <p className="mt-3 text-amber-100 text-sm max-w-md">
              Join our community of animal lovers and discover your new best
              friend today.
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-amber-100">
            <span>Verified Shelter Partner Network</span>
            <div className="flex -space-x-2">
              <span className="w-7 h-7 rounded-full bg-amber-200 border-2 border-orange-500 flex items-center justify-center text-[10px]">
                🐕
              </span>
              <span className="w-7 h-7 rounded-full bg-amber-300 border-2 border-orange-500 flex items-center justify-center text-[10px]">
                🐈
              </span>
              <span className="w-7 h-7 rounded-full bg-amber-100 border-2 border-orange-500 flex items-center justify-center text-[10px]">
                🐾
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Authentication Form */}
        <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900">
              {isSignUp ? "Create account" : "Welcome back"}
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              {isSignUp
                ? "Fill in your details to start adopting"
                : "Enter your credentials to access your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error && onClearError) onClearError();
                  }}
                  placeholder="Jane Doe"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email
              </label>
              <input
                type="email"
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error && onClearError) onClearError();
                }}
                placeholder="name@example.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error && onClearError) onClearError();
                  }}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-500 font-medium mt-2 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-all cursor-pointer"
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
            {isSignUp ? (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => toggleAuthMode(false)}
                  className="text-orange-600 hover:text-orange-700 font-bold transition-colors ml-1 cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => toggleAuthMode(true)}
                  className="text-orange-600 hover:text-orange-700 font-bold transition-colors ml-1 cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}