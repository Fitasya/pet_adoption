import { useState, useEffect } from "react";
import type {
  AdoptionRequest,
  Pet,
  ActiveTab,
  LoginCredentials,
  SignupPayload,
} from "./types";
import { Navbar } from "./components/Navbar";
import { ApplyForm } from "./components/ApplyForm";
import { ReviewDashboard } from "./components/ReviewDashboard";
import { EditForm } from "./components/EditForm";
import { ManagePets } from "./components/ManagePets";
import { AuthForm } from "./components/AuthForm";
import { useAuth } from "./context/AuthContext";
import { toast, Toaster } from "sonner";

export default function App() {
  const [pets, setPets] = useState<Pet[]>([]);

  // 1. Initialize editingId from localStorage
  const [editingId, setEditingId] = useState<string | null>(() => {
    return localStorage.getItem("editingId");
  });

  const { user, setUser } = useAuth();
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/pets")
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch((err) => console.error("Error fetching pets:", err));

    fetch("http://localhost:5000/api/requests")
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error("Error fetching requests:", err));
  }, []);

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return (localStorage.getItem("activeTab") as ActiveTab) || "apply";
  });

  // Save activeTab whenever it changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // 2. Save or clear editingId in localStorage whenever it changes
  useEffect(() => {
    if (editingId) {
      localStorage.setItem("editingId", editingId);
    } else {
      localStorage.removeItem("editingId");
    }
  }, [editingId]);

  const editingRequest = requests.find((r) => r.id === editingId);

  useEffect(() => {
    if (activeTab === "edit" && requests.length > 0 && !editingRequest) {
      setActiveTab("review");
      setEditingId(null);
    }
  }, [activeTab, requests, editingRequest]);

// Collect pet IDs of pending requests for the logged-in user (matched by email)
  const userPendingPetIds = new Set(
    requests
      .filter(
        (req) => req.email === user?.email && req.status === "pending"
      )
      .map((req) => req.petId)
  );

  // Exclude pets with pending requests for the Apply dropdown
  const availablePetsForApply = pets.filter(
    (pet) => !userPendingPetIds.has(pet.id)
  );

  // Exclude pending pets for Edit dropdown, but keep the pet assigned to the request being edited
  const currentEditingPetId = editingRequest ? editingRequest.petId : null;

  const availablePetsForEdit = pets.filter(
    (pet) => !userPendingPetIds.has(pet.id) || pet.id === currentEditingPetId
  );
  const handleLogin = async (credentials: LoginCredentials) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      setUser(data);
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    }
  };

  const handleSignup = async (payload: SignupPayload) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      setUser(data);
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
      console.error("Signup error:", err);
    }
  };

  const handleAddPet = async (formData: FormData) => {
    try {
      const response = await fetch("http://localhost:5000/api/pets", {
        method: "POST",
        body: formData,
      });
      const savedPet = await response.json();
      setPets((prev) => [savedPet, ...prev]);
      toast.success("Pet added successfully!");
    } catch (err) {
      console.error("Failed to save pet:", err);
    }
  };

  const handleDeletePet = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/pets/${id}`, {
        method: "DELETE",
      });
      setPets((prev) => prev.filter((pet) => pet.id !== id));
      toast.success("Pet deleted successfully!");
    } catch (err) {
      console.error("Failed to delete pet:", err);
    }
  };

  const handleAddRequest = async (
    formData: Omit<AdoptionRequest, "id" | "status" | "submittedAt">,
  ) => {
    try {
      const response = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const savedRequest = await response.json();

      if (!response.ok) {
        alert(savedRequest.error || "Failed to submit request");
        return;
      }

      toast.success("Adoption request submitted successfully!");

      setRequests((prev) => [savedRequest, ...prev]);
      setActiveTab("review");
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const handleStatusChange = async (
    id: string,
    status: "approved" | "rejected",
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/requests/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        toast.error("Failed to update status");
        return;
      }

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      );

      toast.success("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleStartEdit = (id: string) => {
    setEditingId(id);
    setActiveTab("edit");
  };

  const handleSaveEdit = async (updated: AdoptionRequest) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/requests/${updated.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        },
      );

      if (!response.ok) {
        toast.error("Failed to save changes");
        return;
      }

      setRequests((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      );

      toast.success("Changes saved successfully!");
      setEditingId(null);
      setActiveTab("review");
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("Failed to cancel request");
        return;
      }

      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("Request cancelled successfully!");
    } catch (err) {
      console.error("Error cancelling request:", err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <AuthForm
          onLogin={handleLogin}
          onSignup={handleSignup}
          error={error}
          onClearError={() => setError(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "bg-white text-gray-900 border border-gray-200",
            success: "bg-orange-50 text-orange-900 border-orange-200",
            icon: "text-orange-500",
          },
        }}
      />
      <Navbar
        role={user.role}
        setRole={(newRole) => setUser({ ...user, role: newRole })}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="p-6">
        {activeTab === "apply" && (
          <ApplyForm
            pets={availablePetsForApply}
            onAddRequest={handleAddRequest}
          />
        )}
        {activeTab === "pets" && (
          <ManagePets
            pets={pets}
            onAddPet={handleAddPet}
            onDeletePet={handleDeletePet}
          />
        )}
        {activeTab === "review" && (
          <ReviewDashboard
            requests={requests}
            onStatusChange={handleStatusChange}
            onEdit={handleStartEdit}
            onDelete={handleDeleteRequest}
          />
        )}
        {activeTab === "edit" && editingRequest && (
          <EditForm
            request={editingRequest}
            pets={availablePetsForEdit}
            onSave={handleSaveEdit}
            onCancel={() => {
              setEditingId(null);
              setActiveTab("review");
            }}
          />
        )}
      </main>
    </div>
  );
}
