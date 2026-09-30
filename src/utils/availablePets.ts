// utils/availablePets.ts
import type { AdoptionRequest, Pet } from "../types";

export function getPendingPetIds(requests: AdoptionRequest[], email?: string) {
  return new Set(
    requests.filter((r) => r.email === email && r.status === "pending").map((r) => r.petId),
  );
}

export function getPetsForApply(pets: Pet[], pendingIds: Set<string>) {
  return pets.filter((p) => !pendingIds.has(p.id));
}

export function getPetsForEdit(pets: Pet[], pendingIds: Set<string>, editingPetId: string | null) {
  return pets.filter((p) => !pendingIds.has(p.id) || p.id === editingPetId);
}