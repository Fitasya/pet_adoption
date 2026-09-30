// hooks/usePersistedState.ts
import { useState, useEffect } from "react";

export function usePersistedState<T extends string | null>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(
    () => (localStorage.getItem(key) as T | null) ?? fallback,
  );

  useEffect(() => {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}