// hooks/useRequests.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { AdoptionRequest, NewAdoptionRequest } from "../types";
import * as api from "../api/requests";

export function useRequests() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);

  useEffect(() => {
    api.getRequests().then(setRequests).catch((e) => console.error("Error fetching requests:", e));
  }, []);

  // returns true on success so the caller can navigate
  const addRequest = async (data: NewAdoptionRequest) => {
    try {
      const saved = await api.createRequest(data);
      setRequests((prev) => [saved, ...prev]);
      toast.success("Adoption request submitted successfully!");
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit request");
      return false;
    }
  };

// hooks/useRequests.ts
const changeStatus = async (id: string, status: "approved" | "rejected") => {
  try {
    const result = await api.updateStatus(id, status);
    const rejected = new Set(result.rejectedIds ?? []);

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) return { ...r, status };
        if (rejected.has(r.id)) return { ...r, status: "rejected" as const };
        return r;
      }),
    );

    toast.success("Status updated successfully!");
  } catch {
    toast.error("Failed to update status");
  }
};

  const saveRequest = async (updated: AdoptionRequest) => {
    try {
      await api.updateRequest(updated);
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      toast.success("Changes saved successfully!");
      return true;
    } catch {
      toast.error("Failed to save changes");
      return false;
    }
  };

  const removeRequest = async (id: string) => {
    try {
      await api.deleteRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("Request cancelled successfully!");
    } catch {
      toast.error("Failed to cancel request");
    }
  };

  return { requests, addRequest, changeStatus, saveRequest, removeRequest };
}