import { Badge } from "@/components/ui/badge";
import { VisitStatusProps } from "@/types/visit";

export function VisitStatus({ status, isOverstayed = false }: VisitStatusProps) {
  function getStatusColor(status: string, isOverstayed: boolean): string {
    if (isOverstayed && status === "CHECKED_IN") {
      return "bg-destructive text-destructive-foreground animate-pulse";
    }

    switch (status) {
      case "PENDING":
        return "bg-yellow-500 text-yellow-50";
      case "APPROVED":
        return "bg-green-500 text-green-50";
      case "CHECKED_IN":
        return "bg-blue-500 text-blue-50";
      case "COMPLETED":
        return "bg-purple-500 text-purple-50";
      case "CANCELLED":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  }

  return (
    <Badge className={getStatusColor(status, isOverstayed)}>
      {isOverstayed && status === "CHECKED_IN" ? "OVERSTAYED" : status}
    </Badge>
  );
} 