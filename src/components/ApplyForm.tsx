import React, { useState, useEffect } from "react";
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
import { useAuth } from "../context/AuthContext";

interface ApplyFormProps {
  pets: Pet[];
  initialPetId?: string | null;
  onAddRequest: (
    request: Omit<AdoptionRequest, "id" | "status" | "submittedAt">,
  ) => void;
}

export function ApplyForm({
  pets,
  initialPetId,
  onAddRequest,
}: ApplyFormProps) {
  const { user } = useAuth(); // Grabs user state globally
  // const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || "");
  const [selectedPetId, setSelectedPetId] = useState<string>(
    pets.find((p) => p.id === initialPetId)?.id ?? pets[0]?.id ?? "",
  );
  const [applicantName, setApplicantName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPet = pets.find((p) => p.id === selectedPetId);

    // don't submit if any required fields are missing
    if (!applicantName || !email || !selectedPet || !reason) return;

    onAddRequest({
      applicantName,
      email,
      petId: selectedPet.id,
      petName: `${selectedPet.name} (${selectedPet.breed})`,
      reason,
    });

    // Reset form after submission
    setApplicantName(user?.name || "");
    setEmail(user?.email || "");
    setReason("");
  };

  useEffect(() => {
    if (user) {
      setApplicantName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  return (
    <Card className="max-w-2xl mx-auto border border-slate-400 shadow-sm">
      <CardHeader>
        <CardTitle>Pet Adoption Application</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-8">
            <div className="space-y-1">
              <label className="text-sm font-medium">Your Full Name</label>
              <Input
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                required
                placeholder="Jane Doe"
                disabled
                className="disabled:border-slate-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="jane@example.com"
                disabled
                className="disabled:border-slate-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">
                Select a Pet to Adopt
              </label>
              {pets.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No pets available for adoption currently.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pets.map((pet) => {
                    const isSelected = pet.id === selectedPetId;
                    return (
                      <div
                        key={pet.id}
                        onClick={() => setSelectedPetId(pet.id)}
                        className={`cursor-pointer rounded-lg border 
                          border-slate-400 p-3 
                          flex gap-3 items-center transition-all ${
                            isSelected
                              ? " border-white bg-orange-50/50 dark:bg-orange-950/30 ring-2 ring-orange-600"
                              : "hover:border-slate-500"
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
              <label className="text-sm font-medium">
                Why do you want to adopt this pet?
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                placeholder="Describe your home setup..."
                className="focus:border-orange-600 focus:bg-orange-50/50 
                 focus:ring-2 focus:ring-orange-600 bg-white border-slate-400"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            type="submit"
            disabled={pets.length === 0 || !selectedPetId}
            className="bg-orange-500 hover:bg-orange-600 text-white mt-4 w-50 
            disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            Submit Application
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
