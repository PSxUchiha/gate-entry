"use client";

import { useState, useEffect } from "react";
import { differenceInMinutes } from "date-fns";
import { Visit, Visitor, Employee, Department } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VisitStatus } from "@/components/visit/visit-status";
import { useToast } from "@/hooks/use-toast";
import { ActivityFilters } from "@/components/visit/activity-filters";

interface VisitWithRelations extends Visit {
  visitor: Visitor;
  employee: Employee;
  department: Department;
}

interface VisitManagementProps {
  visits: VisitWithRelations[];
  onStatusUpdate: (visitId: string, status: string) => void;
}

export function VisitManagement({ visits, onStatusUpdate }: VisitManagementProps) {
  const [filter, setFilter] = useState<"pending" | "active" | "completed">("active");
  const [filteredVisits, setFilteredVisits] = useState<VisitWithRelations[]>([]);
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

  // Handle date range changes
  const handleDateRangeChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    let filtered = [...visits];

    // First apply date filter if dates are selected
    if (startDate && endDate) {
      filtered = filtered.filter(visit => {
        const visitDate = new Date(visit.createdAt);
        return visitDate >= startDate && visitDate <= endDate;
      });
    }

    // Then apply status filter
    filtered = filtered.filter((visit) => {
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

    setFilteredVisits(filtered);
  };

  // Update filtered visits when filter changes
  useEffect(() => {
    handleDateRangeChange(undefined, undefined);
  }, [filter, visits]);

  // Function to check if a visit is overstayed
  const isVisitOverstayed = (visit: VisitWithRelations): boolean => {
    if (visit.status !== "CHECKED_IN" || !visit.checkInTime) return false;
    const duration = differenceInMinutes(new Date(), new Date(visit.checkInTime));
    return duration > visit.timeAllotted;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col gap-4 bg-card/50 p-4 rounded-lg animate-slide-in-bottom">
        <div className="flex gap-2">
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
        <ActivityFilters visits={filteredVisits} onDateRangeChange={handleDateRangeChange} />
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
                  <p className="text-sm text-muted-foreground">Purpose</p>
                  <p className="font-medium">{visit.purpose}</p>
                </div>
                <div className="space-y-1 animate-slide-in-bottom" style={{ animationDelay: '0.4s' }}>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{new Date(visit.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 