import React, { useState } from "react";
import type { Pet } from "../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Trash2, PlusCircle, Upload } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";

interface ManagePetsProps {
  pets: Pet[];
  onAddPet: (formData: FormData) => void;
  onDeletePet: (id: string) => void;
}

export function ManagePets({ pets, onAddPet, onDeletePet }: ManagePetsProps) {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); // Lightweight browser blob preview
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !breed || !selectedFile) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("breed", breed);
    formData.append("description", description);
    formData.append("image", selectedFile);

    onAddPet(formData);

    setName("");
    setBreed("");
    setDescription("");
    setSelectedFile(null);
    setImagePreview("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="border shadow-sm border-slate-400">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-emerald-600" />
            Add New Available Pet
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Pet Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Buddy"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white border 
                    border-slate-400 text-slate-800 placeholder-slate-400 
                    focus:outline-none focus:ring-2 focus:ring-orange-500 
                    focus:bg-orange-50/50 transition-all focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Breed / Species</label>
              <Input
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                required
                placeholder="e.g. Beagle"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white border 
                    border-slate-400 text-slate-800 placeholder-slate-400 
                    focus:outline-none focus:ring-2 focus:ring-orange-500 
                    focus:bg-orange-50/50 transition-all focus:border-orange-500"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Upload Pet Photo</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="cursor-pointer bg-white border-slate-400 rounded-xl"
                
              />
              {imagePreview && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded-md border"
                  />
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <Upload className="h-3 w-3" /> File ready to upload
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short bio..."
                 className="w-full px-4 py-3 pr-12 rounded-xl bg-white border 
                    border-slate-400 text-slate-800 placeholder-slate-400 
                    focus:outline-none focus:ring-2 focus:ring-orange-500 
                    focus:bg-orange-50/50 transition-all focus:border-orange-500"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button
              type="submit"
              disabled={!selectedFile}
              className="hover:cursor-pointer w-50 bg-orange-500 hover:bg-orange-600 
              text-white mt-4"
            >
              Add Pet to Listing
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div>
        <h3 className="text-xl font-bold mb-4">
          Current Available Pets ({pets.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pets.map((pet) => (
            <Card
              key={pet.id}
              className="overflow-hidden flex flex-col 
              justify-between border border-slate-400"
            >
              <div>
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="h-48 w-full object-cover"
                />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{pet.name}</CardTitle>
                      <span className="text-xs text-slate-500">
                        {pet.breed}
                      </span>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-rose-600"
                      onClick={() => setDeletingPetId(pet.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {pet.description}
                  </p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={deletingPetId !== null}
        title="Delete Pet Listing"
        message="Are you sure you want to delete this pet? This action cannot be undone."
        confirmText="Yes"
        cancelText="Cancel"
        variant="danger"
        onClose={() => setDeletingPetId(null)}
        onConfirm={() => {
          if (deletingPetId) {
            onDeletePet(deletingPetId);
            setDeletingPetId(null);
          }
        }}
      />
    </div>
  );
}
