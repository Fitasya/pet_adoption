// api/auth.ts
import { request, jsonBody } from "./client";
import type { LoginCredentials, SignupPayload } from "../types";
import type { User } from "../types"; // whatever useAuth's user type is

export const login = (c: LoginCredentials) =>
  request<User>("/login", { method: "POST", ...jsonBody(c) });
export const signup = (p: SignupPayload) =>
  request<User>("/signup", { method: "POST", ...jsonBody(p) });

export const changePassword = (data: {
  email: string;
  currentPassword: string;
  newPassword: string;
}) => request<{message: string}>("/change-password", {method: "PATCH", ...jsonBody(data)});