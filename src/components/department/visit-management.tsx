"use client";

import { useState, useEffect } from "react";
import { Visit, Visitor, Employee, Department } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case "APPROVED":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "CHECKED_IN":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    case "COMPLETED":
      return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
    case "CANCELLED":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
  }
};

export function DepartmentVisitManagement({ visits, onStatusUpdate }: VisitManagementProps) {
  const [filter, setFilter] = useState<"pending" | "active" | "completed">("pending");
  const [filteredVisits, setFilteredVisits] = useState<VisitWithRelations[]>([]);
  const [localVisits, setLocalVisits] = useState<VisitWithRelations[]>(visits);

  // Update localVisits when props change
  useEffect(() => {
    setLocalVisits(visits);
  }, [visits]);

  // Handle real-time visit updates
  const handleVisitUpdate = async (visitId: string, status: string) => {
    try {
      const response = await fetch(`/api/visits/${visitId}`, {
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
      
      // Update local state
      setLocalVisits(prevVisits => 
        prevVisits.map(visit => 
          visit.id === updatedVisit.id ? updatedVisit : visit
        )
      );

      // Call parent's onStatusUpdate if provided
      if (onStatusUpdate) {
        onStatusUpdate(visitId, status);
      }
    } catch (error) {
      console.error("Failed to update visit status:", error);
    }
  };

  // Handle date range changes
  const handleDateRangeChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    let filtered = [...localVisits];

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
          return visit.status === "PENDING";
        case "active":
          return visit.status === "CHECKED_IN";
        case "completed":
          return visit.status === "COMPLETED" || visit.status === "CANCELLED";
        default:
          return true;
      }
    });

    setFilteredVisits(filtered);
  };

  // Update filtered visits when filter or localVisits change
  useEffect(() => {
    handleDateRangeChange(undefined, undefined);
  }, [filter, localVisits]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visit Requests</CardTitle>
        <CardDescription>Manage and approve visit requests for your department</CardDescription>
        <div className="flex gap-2 mt-4">
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
            className="flex-1"
          >
            Pending Requests
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            onClick={() => setFilter("active")}
            className="flex-1"
          >
            Active Visits
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
            className="flex-1"
          >
            Past Visits
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ActivityFilters visits={filteredVisits} onDateRangeChange={handleDateRangeChange} />
        <div className="grid gap-4">
          {filteredVisits.map((visit) => (
            <div
              key={visit.id}
              className="p-4 border rounded-lg bg-card shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{visit.visitor.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {visit.visitor.company || "Internal Visit"}
                  </p>
                </div>
                <Badge className={getStatusColor(visit.status)}>
                  {visit.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Meeting With</p>
                  <p className="text-sm">{visit.employee.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Purpose</p>
                  <p className="text-sm">{visit.purpose}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm">{visit.timeAllotted} minutes</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Requested On</p>
                  <p className="text-sm">
                    {format(new Date(visit.createdAt), "MMM d, yyyy h:mm a")}
                  </p>
                </div>
                {visit.checkInTime && (
                  <div>
                    <p className="text-sm font-medium">Check-in Time</p>
                    <p className="text-sm">
                      {format(new Date(visit.checkInTime), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                )}
              </div>

              {visit.status === "PENDING" && (
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={() => handleVisitUpdate(visit.id, "APPROVED")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleVisitUpdate(visit.id, "CANCELLED")}
                  >
                    Reject
                  </Button>
                </div>
              )}
              
              {visit.status === "CHECKED_IN" && (
                <div className="flex justify-end">
                  <Button
                    variant="default"
                    onClick={() => handleVisitUpdate(visit.id, "COMPLETED")}
                  >
                    Check Out
                  </Button>
                </div>
              )}
            </div>
          ))}

          {filteredVisits.length === 0 && (
            <div className="text-center py-8 text-muted-foreground bg-card/50 rounded-lg">
              No visits found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 