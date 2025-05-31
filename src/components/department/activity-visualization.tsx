"use client";

import { useMemo } from "react";
import { Visit, Visitor, Employee, Department } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface VisitWithRelations extends Visit {
  visitor: Visitor;
  employee: Employee;
  department: Department;
}

interface ActivityVisualizationProps {
  visits: VisitWithRelations[];
}

const COLORS = {
  PENDING: "#eab308", // yellow-600
  APPROVED: "#16a34a", // green-600
  CHECKED_IN: "#2563eb", // blue-600
  COMPLETED: "#9333ea", // purple-600
  CANCELLED: "#dc2626", // red-600
};

export function DepartmentActivityVisualization({ visits }: ActivityVisualizationProps) {
  const todayVisits = useMemo(() => {
    const today = new Date();
    return visits.filter((visit) => {
      const visitDate = new Date(visit.createdAt);
      return (
        visitDate.getDate() === today.getDate() &&
        visitDate.getMonth() === today.getMonth() &&
        visitDate.getFullYear() === today.getFullYear()
      );
    });
  }, [visits]);

  const employeeStats = useMemo(() => {
    const stats = new Map<string, { name: string; visits: number; active: number }>();
    
    todayVisits.forEach((visit) => {
      const emp = visit.employee.name;
      const current = stats.get(emp) || { name: emp, visits: 0, active: 0 };
      current.visits += 1;
      if (visit.status === "CHECKED_IN") {
        current.active += 1;
      }
      stats.set(emp, current);
    });

    return Array.from(stats.values());
  }, [todayVisits]);

  const statusStats = useMemo(() => {
    const stats = {
      total: todayVisits.length,
      pending: todayVisits.filter((v) => v.status === "PENDING").length,
      approved: todayVisits.filter((v) => v.status === "APPROVED").length,
      active: todayVisits.filter((v) => v.status === "CHECKED_IN").length,
      completed: todayVisits.filter((v) => v.status === "COMPLETED").length,
      cancelled: todayVisits.filter((v) => v.status === "CANCELLED").length,
    };
    return stats;
  }, [todayVisits]);

  const statusData = useMemo(() => {
    return [
      { name: "Pending", value: statusStats.pending, color: COLORS.PENDING },
      { name: "Approved", value: statusStats.approved, color: COLORS.APPROVED },
      { name: "Active", value: statusStats.active, color: COLORS.CHECKED_IN },
      { name: "Completed", value: statusStats.completed, color: COLORS.COMPLETED },
      { name: "Cancelled", value: statusStats.cancelled, color: COLORS.CANCELLED },
    ];
  }, [statusStats]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Activity</CardTitle>
        <CardDescription>
          Overview of today's visit requests and their status
        </CardDescription>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="p-4 border rounded-lg bg-blue-50">
            <p className="text-sm font-medium text-blue-600">Total Requests</p>
            <p className="text-2xl font-bold text-blue-700">{statusStats.total}</p>
          </div>
          <div className="p-4 border rounded-lg bg-green-50">
            <p className="text-sm font-medium text-green-600">Approved/Active</p>
            <p className="text-2xl font-bold text-green-700">
              {statusStats.approved + statusStats.active}
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-purple-50">
            <p className="text-sm font-medium text-purple-600">Completed Today</p>
            <p className="text-2xl font-bold text-purple-700">{statusStats.completed}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Visit Status Distribution</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm">Count: {data.value}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Employee Visit Distribution</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={employeeStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm">Total Visits: {data.visits}</p>
                            <p className="text-sm">Active Now: {data.active}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="visits" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 