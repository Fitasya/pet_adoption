// api/requests.ts
import { request, jsonBody } from "./client";
import type { AdoptionRequest, NewAdoptionRequest } from "../types";

export const getRequests = () => request<AdoptionRequest[]>("/requests");
export const createRequest = (data: NewAdoptionRequest) =>
  request<AdoptionRequest>("/requests", { method: "POST", ...jsonBody(data) });

export const updateRequest = (r: AdoptionRequest) =>
  request<void>(`/requests/${r.id}`, { method: "PUT", ...jsonBody(r) });
export const deleteRequest = (id: string) =>
  request<void>(`/requests/${id}`, { method: "DELETE" });
// api/requests.ts
export type StatusChangeResult = {
  message: string;
  petId?: string;
  rejectedIds?: string[];
};

export const updateStatus = (id: string, status: "approved" | "rejected") =>
  request<StatusChangeResult>(`/requests/${id}/status`, {
    method: "PATCH",
    ...jsonBody({ status }),
  });