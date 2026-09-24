import React, { useState } from "react";
import type { AdoptionRequest, Pet } from "../types";
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
import { Check } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";

interface EditFormProps {
  request: AdoptionRequest;
  pets: Pet[];
  onSave: (updated: AdoptionRequest) => void;
  onCancel: () => void;
}

export function EditForm({ request, pets, onSave, onCancel }: EditFormProps) {
  console.log(request);
  if (!request) {
    return (
        <div className="text-center p-6">
          <p className="text-slate-500">No request selected for editing.</p>
          <Button onClick={onCancel} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
    );
  }
  const [applicantName, setApplicantName] = useState(request.applicantName);
  const [email, setEmail] = useState(request.email);
  const [selectedPetId, setSelectedPetId] = useState<string>(request.petId);
  const [reason, setReason] = useState(request.reason);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    const selectedPet = pets.find((p) => p.id === selectedPetId);

    if (!selectedPet) return;

    onSave({
      ...request,
      applicantName,
      email,
      petId: selectedPet.id,
      petName: `${selectedPet.name} (${selectedPet.breed})`,
      reason,
    });
    setIsConfirmOpen(false);
  };

  return (
    <Card className="max-w-2xl mx-auto border shadow-sm">
      <CardHeader>
        <CardTitle>Edit Application</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Applicant Name</label>
            <Input
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              required
              disabled
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select a Pet</label>
            {pets.length === 0 ? (
              <p className="text-sm text-slate-500">
                No pets available currently.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pets.map((pet) => {
                  const isSelected = pet.id === selectedPetId;
                  return (
                    <div
                      key={pet.id}
                      onClick={() => setSelectedPetId(pet.id)}
                      className={`cursor-pointer rounded-lg border p-3 flex gap-3 items-center transition-all ${
                        isSelected
                          ? "border-orange-600 bg-orange-50/50 dark:bg-orange-950/30 ring-2 ring-orange-600"
                          : "hover:border-slate-300"
                      }`}
                    >
                      <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm truncate">
                            {pet.name}
                          </span>
                          <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 shrink-0">
                            {pet.breed}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {pet.description}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Reason</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 bg-gray-100 text-gray-700 
            border-gray-300 hover:cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={pets.length === 0 || !selectedPetId}
            className="flex-1 bg-orange-500 hover:bg-orange-600 
            text-white hover:cursor-pointer disabled:opacity-50 
            disabled:cursor-not-allowed"
          >
            Save Changes
          </Button>
        </CardFooter>
      </form>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Save Changes"
        message="Are you sure you want to save the changes to this application?"
        confirmText="Save"
        cancelText="Cancel"
        variant="success"
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSave}
      />
    </Card>
  );
}
