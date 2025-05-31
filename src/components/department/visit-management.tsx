"use client";

import { useState } from "react";
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

interface VisitWithRelations extends Visit {
  visitor: Visitor;
  employee: Employee;
  department: Department;
}

interface VisitManagementProps {
  visits: VisitWithRelations[];
  onStatusUpdate: (visitId: string, newStatus: string) => Promise<void>;
}

export function DepartmentVisitManagement({ visits, onStatusUpdate }: VisitManagementProps) {
  const [filter, setFilter] = useState<"pending" | "approved" | "completed">("pending");

  const filteredVisits = visits.filter((visit) => {
    switch (filter) {
      case "pending":
        return visit.status === "PENDING";
      case "approved":
        return visit.status === "APPROVED" || visit.status === "CHECKED_IN";
      case "completed":
        return visit.status === "COMPLETED";
      default:
        return true;
    }
  });

  function getStatusColor(status: string): string {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "APPROVED":
        return "bg-green-500";
      case "CHECKED_IN":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-purple-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visit Requests</CardTitle>
        <CardDescription>Manage and approve visit requests for your department</CardDescription>
        <div className="flex gap-2 mt-4">
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
          >
            Pending Approval
          </Button>
          <Button
            variant={filter === "approved" ? "default" : "outline"}
            onClick={() => setFilter("approved")}
          >
            Approved
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
              </div>

              {visit.status === "PENDING" && (
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => onStatusUpdate(visit.id, "APPROVED")}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => onStatusUpdate(visit.id, "CANCELLED")}
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}

          {filteredVisits.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No visits found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 