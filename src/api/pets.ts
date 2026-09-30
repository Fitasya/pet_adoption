// api/pets.ts
import { request } from "./client";
import type { Pet } from "../types";

export const getPets = () => request<Pet[]>("/pets");
export const createPet = (formData: FormData) =>
  request<Pet>("/pets", { method: "POST", body: formData });
export const deletePet = (id: string) =>
  request<void>(`/pets/${id}`, { method: "DELETE" });