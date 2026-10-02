import type { AdoptionRequest } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CheckCircle2, XCircle, Edit, Trash2 } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface ReviewDashboardProps {
  requests: AdoptionRequest[];
  onStatusChange: (id: string, status: "approved" | "rejected") => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ReviewDashboard({
  requests,
  onStatusChange,
  onEdit,
  onDelete,
}: ReviewDashboardProps) {
  console.log(requests);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [modalAction, setModalAction] = useState<
    "approved" | "rejected" | "delete" | null
  >(null);
  const { user } = useAuth();

  const role = user?.role;

  const displayedRequests =
    role === "reviewer"
      ? requests
      : requests.filter((req) => req.email === user?.email);

  const getStatusBadge = (status: string) => {
    if (status === "approved")
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
          Approved
        </Badge>
      );
    if (status === "rejected")
      return (
        <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20">
          Rejected
        </Badge>
      );
    return (
      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
        Pending
      </Badge>
    );
  };

  const getModalConfig = () => {
    switch (modalAction) {
      case "approved":
        return {
          title: "Approve Application",
          message: "Are you sure you want to approve this application?",
          variant: "success" as const,
          confirmText: "Yes, Approve",
        };
      case "rejected":
        return {
          title: "Reject Application",
          message: "Are you sure you want to reject this application?",
          variant: "danger" as const,
          confirmText: "Yes, Reject",
        };
      case "delete":
        return {
          title: "Delete Application",
          message:
            "Are you sure you want to delete this application? This action cannot be undone.",
          variant: "danger" as const,
          confirmText: "Yes, Delete",
        };
      default:
        return {
          title: "",
          message: "",
          variant: "danger" as const,
          confirmText: "",
        };
    }
  };

  const modalConfig = getModalConfig();

  const handleConfirm = () => {
    if (!requestId || !modalAction) return;

    if (modalAction === "delete") {
      onDelete(requestId);
    } else {
      onStatusChange(requestId, modalAction);
    }

    setRequestId(null);
    setModalAction(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-0">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Applications Dashboard</h2>
        <span className="text-sm text-slate-500">
          Total: {displayedRequests.length}
        </span>
      </div>

      <div
        className="border border-slate-400 rounded-lg overflow-auto 
      bg-background max-h-[calc(100vh-160px)]"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-[-1px] bg-orange-300 
              text-slate-900 font-semibold ">
                Applicant
              </TableHead>
              <TableHead className="sticky top-0 z-[-1px] bg-orange-300 text-slate-900 font-semibold">
                Pet
              </TableHead>
              <TableHead className="sticky top-0 z-[-1px] bg-orange-300 text-slate-900 font-semibold">
                Reason
              </TableHead>
              <TableHead className="sticky top-0 z-[-1px] bg-orange-300 text-slate-900 font-semibold">
                Date
              </TableHead>
              <TableHead className="sticky top-0 z-[-1px] bg-orange-300 text-slate-900 font-semibold">
                Status
              </TableHead>
              <TableHead className="sticky top-0 z-[-1px] bg-orange-300 text-right text-slate-900 font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedRequests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-slate-500"
                >
                  No applications found.
                </TableCell>
              </TableRow>
            ) : (
              displayedRequests.map((req) => (
                <TableRow key={req.id} className="hover:bg-orange-100">
                  <TableCell>
                    <div className="font-medium">{req.applicantName}</div>
                    <div className="text-xs text-slate-500">{req.email}</div>
                  </TableCell>
                  <TableCell>{req.petName}</TableCell>
                  <TableCell className="max-w-xs wrap-break-word whitespace-break-spaces">
                    {req.reason}
                  </TableCell>
                  <TableCell>{req.submittedAt}</TableCell>
                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                  <TableCell className="text-right space-x-3">
                    {role === "reviewer" && req.status === "pending" && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-max h-max not-last:bg-emerald-600 
                          rounded-[50%] 
                          text-white hover:bg-emerald-700 
                          hover:cursor-pointer"
                          onClick={() => {
                            setRequestId(req.id);
                            setModalAction("approved");
                          }}
                        >
                          <CheckCircle2 className="size-7" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-max h-max text-white 
                          bg-rose-600 hover:bg-rose-700 
                          rounded-[50%] hover:cursor-pointer"
                          onClick={() => {
                            setRequestId(req.id);
                            setModalAction("rejected");
                          }}
                        >
                          <XCircle className="size-7" />
                        </Button>
                      </>
                    )}

                    {role === "applicant" && req.status === "pending" && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEdit(req.id)}
                          className="w-7 h-7 text-white 
                          bg-slate-600 hover:bg-slate-700 
                          rounded-[50%] hover:cursor-pointer"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-7 h-7 text-white 
                          bg-rose-600 hover:bg-rose-700 
                          rounded-[50%] hover:cursor-pointer"
                          onClick={() => {
                            setRequestId(req.id);
                            setModalAction("delete");
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmModal
        isOpen={requestId !== null}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText="Cancel"
        variant={modalConfig.variant}
        onClose={() => {
          setRequestId(null);
          setModalAction(null);
        }}
        onConfirm={handleConfirm}
      />
    </div>
  );
}