"use client";

import { useMemo, useState } from "react";
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
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ActivityFilters } from "@/components/visit/activity-filters";

type VisitStatus = "PENDING" | "APPROVED" | "REJECTED" | "CHECKED_IN" | "COMPLETED";

interface VisitWithRelations extends Visit {
  visitor: Visitor;
  employee: Employee;
  department: Department;
}

interface ActivityVisualizationProps {
  visits: VisitWithRelations[];
}

const COLORS = [
  "rgb(189, 147, 249)", // Dracula Purple
  "rgb(80, 250, 123)",  // Dracula Green
  "rgb(139, 233, 253)", // Dracula Cyan
  "rgb(255, 184, 108)", // Dracula Orange
  "rgb(255, 85, 85)",   // Dracula Red
];

const statusLabels: Record<VisitStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CHECKED_IN: "Checked In",
  COMPLETED: "Completed",
};

export function ActivityVisualization({ visits }: ActivityVisualizationProps) {
  const [filteredVisits, setFilteredVisits] = useState<VisitWithRelations[]>(visits);

  const handleDateRangeChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    if (!startDate || !endDate) {
      setFilteredVisits(visits);
      return;
    }

    const filtered = visits.filter(visit => {
      const visitDate = new Date(visit.createdAt);
      return visitDate >= startDate && visitDate <= endDate;
    });
    setFilteredVisits(filtered);
  };

  const statusStats = useMemo(() => {
    const stats = new Map<VisitStatus, { status: string; count: number }>();
    
    filteredVisits.forEach((visit) => {
      const status = visit.status as VisitStatus;
      const current = stats.get(status) || { status: statusLabels[status], count: 0 };
      current.count += 1;
      stats.set(status, current);
    });

    return Array.from(stats.values());
  }, [filteredVisits]);

  const summaryStats = useMemo(() => {
    const stats = {
      total: filteredVisits.length,
      active: filteredVisits.filter((v) => v.status === "CHECKED_IN").length,
      completed: filteredVisits.filter((v) => v.status === "COMPLETED").length,
      pending: filteredVisits.filter((v) => ["PENDING", "APPROVED"].includes(v.status)).length,
    };
    return stats;
  }, [filteredVisits]);

  return (
    <div className="relative">
      <div className="glow-primary -top-10 -left-10" />
      <div className="glow-accent bottom-10 right-10" />
      
      <Card className="glass-card relative z-10">
        <CardHeader>
          <CardTitle>Your Activity</CardTitle>
          <CardDescription>
            Overview of your visitor management activity
          </CardDescription>
          <ActivityFilters visits={filteredVisits} onDateRangeChange={handleDateRangeChange} />
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="glass-darker p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Total Visits</p>
              <p className="text-2xl font-bold text-foreground">{summaryStats.total}</p>
            </div>
            <div className="glass-darker p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Active Visits</p>
              <p className="text-2xl font-bold text-foreground">{summaryStats.active}</p>
            </div>
            <div className="glass-darker p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-foreground">{summaryStats.completed}</p>
            </div>
            <div className="glass-darker p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-foreground">{summaryStats.pending}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="glass-darker p-6 rounded-lg">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    opacity={0.1} 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="status" 
                    stroke="currentColor" 
                    opacity={0.7}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="currentColor" 
                    opacity={0.7}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Bar 
                    dataKey="count" 
                    radius={[4, 4, 0, 0]}
                  >
                    {statusStats.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {statusStats.map((stat, index) => (
                <div 
                  key={stat.status}
                  className="glass p-4 rounded-lg text-center"
                >
                  <div 
                    className="w-3 h-3 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <p className="text-sm font-medium mb-1 truncate" title={stat.status}>
                    {stat.status}
                  </p>
                  <p className="text-2xl font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                    {stat.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 