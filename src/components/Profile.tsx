import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { changePassword } from "../api/auth";
import { ApiError } from "../api/client";
import type {ActiveTab } from "../types";

interface ProfileProps {
  setActiveTab: (tab: ActiveTab) => void;
}
export function Profile({ setActiveTab }: ProfileProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { user, setUser } = useAuth();

  const userName = user?.name || "";
  const email = user?.email || "";

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // ensure new password is different from current password
    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    try {
      await changePassword({
        email: user.email,
        currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully");
      localStorage.removeItem("activeTab");
      setActiveTab("apply");
      setUser(null);
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Unable to connect to server. Please try again.",
      );
    }
  };

  return (
    <div>
      <div
        className="w-xl lg:col-span-5 p-8 lg:p-12 
      flex flex-col justify-center m-auto border-2 border-slate-400 rounded-2xl"
      >
        <h2 className="text-2xl font-bold mb-8">Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div className="space-y-6">
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="block text-small font-medium 
              text-slate-600 "
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                disabled
                value={userName}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border 
                border-slate-200 text-slate-800 placeholder-slate-400 
                focus:outline-none focus:ring-2 focus:ring-orange-500 
                focus:bg-white transition-all disabled:opacity-80"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-small font-medium
              text-slate-600"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                disabled
                value={email}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border 
                border-slate-200 text-slate-800 placeholder-slate-400 
                focus:outline-none focus:ring-2 focus:ring-orange-500 
                focus:bg-white transition-all disabled:opacity-80 "
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="currentPassword"
                className="block text-small font-medium 
              text-slate-600"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                  }}
                  placeholder=""
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white border 
                    border-slate-400 text-slate-800 placeholder-slate-400 
                    focus:outline-none focus:ring-2 focus:ring-orange-500 
                    focus:bg-orange-50/50 transition-all focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 
                  hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
                  aria-label={
                    showCurrentPassword ? "Hide password" : "Show password"
                  }
                >
                  {showCurrentPassword ? (
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

            <div className="space-y-1">
              <label
                htmlFor="newPassword"
                className="block text-small font-medium 
              text-slate-600"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                  placeholder=""
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white border 
                    border-slate-400 text-slate-800 placeholder-slate-400 
                    focus:outline-none focus:ring-2 focus:ring-orange-500 
                    focus:bg-orange-50/50 transition-all focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 
                  hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                  {showNewPassword ? (
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

            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-4 bg-orange-500 
              hover:bg-orange-600 text-white font-bold rounded-xl 
              shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-all 
              cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
