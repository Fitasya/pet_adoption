// hooks/useAuthForm.ts
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as authApi from "../api/auth";
import { ApiError } from "../api/client";
import type { User, LoginCredentials, SignupPayload } from "../types";

export function useAuthForm() {
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const run = async (fn: () => Promise<User>) => {
    setError(null);
    try {
      setUser(await fn());
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : "Unable to connect to server. Please try again.",
      );
    }
  };

  return {
    error,
    clearError: () => setError(null),
    login: (c: LoginCredentials) => run(() => authApi.login(c)),
    signup: (p: SignupPayload) => run(() => authApi.signup(p)),
  };
}