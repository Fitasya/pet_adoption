// App.tsx
import { useEffect } from "react";
import { Toaster } from "sonner";
import type { AdoptionRequest, ActiveTab, NewAdoptionRequest } from "./types";
import { Navbar } from "./components/Navbar";
import { ApplyForm } from "./components/ApplyForm";
import { ReviewDashboard } from "./components/ReviewDashboard";
import { EditForm } from "./components/EditForm";
import { ManagePets } from "./components/ManagePets";
import { AuthForm } from "./components/AuthForm";
import { useAuth } from "./context/AuthContext";
import { usePersistedState } from "./hooks/usePersistedState";
import { usePets } from "./hooks/usePets";
import { useRequests } from "./hooks/useRequests";
import { useAuthForm } from "./hooks/useAuthForm";
import {
  getPendingPetIds,
  getPetsForApply,
  getPetsForEdit,
} from "./utils/availablePets";

export default function App() {
  const { user, setUser } = useAuth();
  const auth = useAuthForm();
  const { pets, addPet, deletePet } = usePets();
  const { requests, addRequest, changeStatus, saveRequest, removeRequest } =
    useRequests();

  const [activeTab, setActiveTab] = usePersistedState<ActiveTab>(
    "activeTab",
    "apply",
  );
  const [editingId, setEditingId] = usePersistedState<string | null>(
    "editingId",
    null,
  );

  const editingRequest = requests.find((r) => r.id === editingId);

  // Bounce out of the edit tab if the request being edited no longer exists
  useEffect(() => {
    if (activeTab === "edit" && requests.length > 0 && !editingRequest) {
      setActiveTab("review");
      setEditingId(null);
    }
  }, [activeTab, requests, editingRequest, setActiveTab, setEditingId]);

  const pendingIds = getPendingPetIds(requests, user?.email);

  const handleAddRequest = async (data: NewAdoptionRequest) => {
    if (await addRequest(data)) setActiveTab("review");
  };

  const handleStartEdit = (id: string) => {
    setEditingId(id);
    setActiveTab("edit");
  };

  const handleSaveEdit = async (updated: AdoptionRequest) => {
    if (await saveRequest(updated)) {
      setEditingId(null);
      setActiveTab("review");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setActiveTab("review");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <AuthForm
          onLogin={auth.login}
          onSignup={auth.signup}
          error={auth.error}
          onClearError={auth.clearError}
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
            pets={getPetsForApply(pets, pendingIds)}
            onAddRequest={handleAddRequest}
          />
        )}
        {activeTab === "pets" && (
          <ManagePets
            pets={pets}
            onAddPet={addPet}
            onDeletePet={deletePet}
          />
        )}
        {activeTab === "review" && (
          <ReviewDashboard
            requests={requests}
            onStatusChange={changeStatus}
            onEdit={handleStartEdit}
            onDelete={removeRequest}
          />
        )}
        {activeTab === "edit" && editingRequest && (
          <EditForm
            request={editingRequest}
            pets={getPetsForEdit(pets, pendingIds, editingRequest.petId)}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        )}
      </main>
    </div>
  );
}