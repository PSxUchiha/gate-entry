"use client";

import { useState, useEffect } from "react";
import { VisitWithRelations } from "@/types/visit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, differenceInMinutes } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { VisitStatus } from "@/components/visit/visit-status";

interface VisitManagementProps {
  visits: VisitWithRelations[];
  onStatusUpdate: (visitId: string, status: string) => Promise<void>;
}

export function VisitManagement({ visits, onStatusUpdate }: VisitManagementProps) {
  const [filter, setFilter] = useState<"pending" | "active" | "completed">("active");
  const { toast } = useToast();

  // Check for overstayed visits every minute
  useEffect(() => {
    const checkOverstayedVisits = () => {
      const now = new Date();
      const overstayedVisits = visits.filter((visit) => {
        if (visit.status !== "CHECKED_IN" || !visit.checkInTime) return false;
        const duration = differenceInMinutes(now, new Date(visit.checkInTime));
        return duration > visit.timeAllotted;
      });

      // Show toast for each overstayed visit
      overstayedVisits.forEach((visit) => {
        toast({
          title: "Visit Duration Exceeded",
          description: `${visit.visitor.name} has exceeded their allotted time of ${visit.timeAllotted} minutes in ${visit.department.name}`,
          variant: "destructive",
        });
      });
    };

    // Check immediately and then every minute
    checkOverstayedVisits();
    const interval = setInterval(checkOverstayedVisits, 60000);

    return () => clearInterval(interval);
  }, [visits, toast]);

  const filteredVisits = visits.filter((visit) => {
    switch (filter) {
      case "pending":
        return visit.status === "APPROVED";
      case "active":
        return visit.status === "CHECKED_IN";
      case "completed":
        return visit.status === "COMPLETED";
      default:
        return true;
    }
  });

  // Function to check if a visit is overstayed
  const isVisitOverstayed = (visit: VisitWithRelations): boolean => {
    if (visit.status !== "CHECKED_IN" || !visit.checkInTime) return false;
    const duration = differenceInMinutes(new Date(), new Date(visit.checkInTime));
    return duration > visit.timeAllotted;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex gap-2 bg-card/50 p-4 rounded-lg animate-slide-in-bottom">
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
          className="min-w-[100px] hover-lift"
        >
          Pending
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          onClick={() => setFilter("active")}
          className="min-w-[100px] hover-lift"
        >
          Active
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
          className="min-w-[100px] hover-lift"
        >
          Completed
        </Button>
      </div>

      <div className="grid gap-4 stagger-animate">
        {filteredVisits.map((visit) => (
          <Card key={visit.id} className="border-border/10 hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                {visit.visitor.name}
                {visit.visitor.company && (
                  <span className="block text-sm text-muted-foreground mt-1 animate-fade-in">
                    {visit.visitor.company}
                  </span>
                )}
              </CardTitle>
              <VisitStatus status={visit.status} isOverstayed={isVisitOverstayed(visit)} />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1 animate-slide-in-bottom" style={{ animationDelay: '0.1s' }}>
                  <p className="text-sm text-muted-foreground">Meeting With</p>
                  <p className="font-medium">{visit.employee.name}</p>
                </div>
                <div className="space-y-1 animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{visit.department.name}</p>
                </div>
                <div className="space-y-1 animate-slide-in-bottom" style={{ animationDelay: '0.3s' }}>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className={`font-medium ${isVisitOverstayed(visit) ? "text-destructive animate-pulse-subtle" : ""}`}>
                    {visit.timeAllotted} minutes
                    {visit.status === "CHECKED_IN" && visit.checkInTime && (
                      <span className="ml-1 text-muted-foreground">
                        ({differenceInMinutes(new Date(), new Date(visit.checkInTime))} mins elapsed)
                      </span>
                    )}
                  </p>
                </div>
                <div className="space-y-1 animate-slide-in-bottom" style={{ animationDelay: '0.4s' }}>
                  <p className="text-sm text-muted-foreground">Unique Code</p>
                  <p className="font-mono font-medium">{visit.uniqueCode}</p>
                </div>
              </div>

              <div className="flex gap-2 animate-slide-in-bottom" style={{ animationDelay: '0.5s' }}>
                {visit.status === "APPROVED" && (
                  <Button
                    className="flex-1 hover-lift"
                    variant="default"
                    onClick={() => onStatusUpdate(visit.id, "CHECKED_IN")}
                  >
                    Check In
                  </Button>
                )}
                {visit.status === "CHECKED_IN" && (
                  <Button
                    className="flex-1 hover-lift"
                    variant="default"
                    onClick={() => onStatusUpdate(visit.id, "COMPLETED")}
                  >
                    Complete Visit
                  </Button>
                )}
                {visit.status === "PENDING" && (
                  <>
                    <Button
                      variant="default"
                      className="flex-1 bg-accent hover:bg-accent/90 hover-lift"
                      onClick={() => onStatusUpdate(visit.id, "APPROVED")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 hover-lift"
                      onClick={() => onStatusUpdate(visit.id, "CANCELLED")}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredVisits.length === 0 && (
          <div className="text-center py-8 text-muted-foreground bg-card/50 rounded-lg animate-fade-in">
            No visits found
          </div>
        )}
      </div>
    </div>
  );
} 