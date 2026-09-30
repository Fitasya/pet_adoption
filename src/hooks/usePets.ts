// hooks/usePets.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Pet } from "../types";
import * as petsApi from "../api/pets";

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    petsApi.getPets().then(setPets).catch((e) => console.error("Error fetching pets:", e));
  }, []);

  const addPet = async (formData: FormData) => {
    try {
      const saved = await petsApi.createPet(formData);
      setPets((prev) => [saved, ...prev]);
      toast.success("Pet added successfully!");
    } catch (e) {
      console.error("Failed to save pet:", e);
    }
  };

  const deletePet = async (id: string) => {
    try {
      await petsApi.deletePet(id);
      setPets((prev) => prev.filter((p) => p.id !== id));
      toast.success("Pet deleted successfully!");
    } catch (e) {
      console.error("Failed to delete pet:", e);
    }
  };

  return { pets, addPet, deletePet };
}