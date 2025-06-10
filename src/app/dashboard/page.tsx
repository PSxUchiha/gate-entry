"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Visit, Visitor, Employee, Department } from "@prisma/client";
import { VisitManagement } from "@/components/security/visit-management";
import { ActivityVisualization as SecurityActivityVisualization } from "@/components/security/activity-visualization";
import { DashboardHeader } from "@/components/security/dashboard-header";
import { DepartmentVisitManagement } from "@/components/department/visit-management";
import { ActivityVisualization as DepartmentActivityVisualization } from "@/components/department/activity-visualization";
import { DepartmentDashboardHeader } from "@/components/department/dashboard-header";
import { Tabs, TabsContent } from "@/components/ui/tabs";

interface VisitWithRelations extends Visit {
  visitor: Visitor;
  employee: Employee;
  department: Department;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "employee";
  const departmentId = searchParams.get("departmentId");
  const [visits, setVisits] = useState<VisitWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("management");

  useEffect(() => {
    fetchVisits();
  }, [type, departmentId]);

  async function fetchVisits() {
    try {
      const url = type === "employee" && departmentId
        ? `/api/visits?departmentId=${departmentId}`
        : "/api/visits";
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch visits");
      }
      const data = await response.json();
      setVisits(data);
    } catch (error) {
      console.error("Error fetching visits:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusUpdate(visitId: string, newStatus: string) {
    try {
      const response = await fetch(`/api/visits/${visitId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update visit status");
      }

      // Refresh visits after update
      fetchVisits();
    } catch (error) {
      console.error("Error updating visit status:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "employee" && departmentId) {
    return (
      <div className="container mx-auto py-8">
        <DepartmentDashboardHeader 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          departmentId={departmentId}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="management" className="mt-6">
            <DepartmentVisitManagement
              visits={visits}
              onStatusUpdate={handleStatusUpdate}
            />
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <DepartmentActivityVisualization visits={visits} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="management" className="mt-6">
          <VisitManagement
            visits={visits}
            onStatusUpdate={handleStatusUpdate}
          />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <SecurityActivityVisualization visits={visits} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
} 