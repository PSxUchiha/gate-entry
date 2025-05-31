import { Button } from "@/components/ui/button";
import { VisitWithRelations } from "@/types/visit";

interface VisitActionsProps {
  visit: VisitWithRelations;
}

export function VisitActions({ visit }: VisitActionsProps) {
  const canApprove = visit.status === "PENDING";
  const canCheckIn = visit.status === "APPROVED";
  const canComplete = visit.status === "CHECKED_IN";

  return (
    <div className="flex gap-2">
      {canApprove && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // TODO: Implement approve action
          }}
        >
          Approve
        </Button>
      )}
      {canCheckIn && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // TODO: Implement check-in action
          }}
        >
          Check In
        </Button>
      )}
      {canComplete && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // TODO: Implement complete action
          }}
        >
          Complete
        </Button>
      )}
    </div>
  );
} 