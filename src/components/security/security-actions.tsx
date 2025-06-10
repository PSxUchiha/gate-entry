"use client";

import { Button } from "@/components/ui/button";
import { VisitWithRelations } from "@/types/visit";

interface SecurityActionsProps {
  visit: VisitWithRelations;
  onUpdate?: (updatedVisit: VisitWithRelations) => void;
}

export function SecurityActions({ visit, onUpdate }: SecurityActionsProps) {
  const handleStatusUpdate = async (status: string) => {
    try {
      const response = await fetch(`/api/visits/${visit.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update visit status");
      }

      const updatedVisit = await response.json();
      
      // Call the onUpdate callback with the updated visit data
      if (onUpdate) {
        onUpdate(updatedVisit);
      }
    } catch (error) {
      console.error("Failed to update visit status:", error);
    }
  };

  return (
    <div className="flex gap-2">
      {visit.status === "APPROVED" && (
        <Button
          size="sm"
          onClick={() => handleStatusUpdate("CHECKED_IN")}
        >
          Check In
        </Button>
      )}
      {visit.status === "CHECKED_IN" && (
        <Button
          size="sm"
          onClick={() => handleStatusUpdate("COMPLETED")}
        >
          Complete
        </Button>
      )}
      {visit.status === "PENDING" && (
        <>
          <Button
            size="sm"
            variant="default"
            onClick={() => handleStatusUpdate("APPROVED")}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleStatusUpdate("CANCELLED")}
          >
            Cancel
          </Button>
        </>
      )}
    </div>
  );
} 