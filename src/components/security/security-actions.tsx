"use client";

import { Button } from "@/components/ui/button";
import { VisitWithRelations } from "@/types/visit";
import { useToast } from "@/hooks/use-toast";

interface SecurityActionsProps {
  visit: VisitWithRelations;
}

export function SecurityActions({ visit }: SecurityActionsProps) {
  const { toast } = useToast();

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

      toast({
        title: "Status Updated",
        description: `Visit status has been updated to ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update visit status. Please try again.",
        variant: "destructive",
      });
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