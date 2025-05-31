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

const COLORS = [
  "#2563eb", // blue-600
  "#16a34a", // green-600
  "#dc2626", // red-600
  "#9333ea", // purple-600
  "#ea580c", // orange-600
  "#0891b2", // cyan-600
];

export function ActivityVisualization({ visits }: ActivityVisualizationProps) {
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

  const departmentStats = useMemo(() => {
    const stats = new Map<string, { name: string; visits: number; active: number }>();
    
    todayVisits.forEach((visit) => {
      const dept = visit.department.name;
      const current = stats.get(dept) || { name: dept, visits: 0, active: 0 };
      current.visits += 1;
      if (visit.status === "CHECKED_IN") {
        current.active += 1;
      }
      stats.set(dept, current);
    });

    return Array.from(stats.values());
  }, [todayVisits]);

  const statusStats = useMemo(() => {
    const stats = {
      total: todayVisits.length,
      active: todayVisits.filter((v) => v.status === "CHECKED_IN").length,
      completed: todayVisits.filter((v) => v.status === "COMPLETED").length,
      pending: todayVisits.filter((v) => v.status === "APPROVED").length,
    };
    return stats;
  }, [todayVisits]);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Daily Activity</CardTitle>
        <CardDescription>
          Overview of today's visits across departments
        </CardDescription>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="p-4 border rounded-lg bg-blue-50">
            <p className="text-sm font-medium text-blue-600">Total Visits</p>
            <p className="text-2xl font-bold text-blue-700">{statusStats.total}</p>
          </div>
          <div className="p-4 border rounded-lg bg-green-50">
            <p className="text-sm font-medium text-green-600">Active Visits</p>
            <p className="text-2xl font-bold text-green-700">{statusStats.active}</p>
          </div>
          <div className="p-4 border rounded-lg bg-purple-50">
            <p className="text-sm font-medium text-purple-600">Completed</p>
            <p className="text-2xl font-bold text-purple-700">{statusStats.completed}</p>
          </div>
          <div className="p-4 border rounded-lg bg-yellow-50">
            <p className="text-sm font-medium text-yellow-600">Pending Check-ins</p>
            <p className="text-2xl font-bold text-yellow-700">{statusStats.pending}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              <Bar dataKey="visits">
                {departmentStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 