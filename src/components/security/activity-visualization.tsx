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
  Legend,
} from "recharts";
import { ActivityFilters } from "@/components/visit/activity-filters";

interface VisitWithRelations extends Visit {
  visitor: Visitor;
  employee: Employee;
  department: Department;
}

interface ActivityVisualizationProps {
  visits: VisitWithRelations[];
}

const COLORS = {
  visits: "rgb(255, 121, 198)", // Dracula Pink
  departments: "rgb(189, 147, 249)", // Dracula Purple
  active: "rgb(80, 250, 123)", // Dracula Green
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

  const departmentStats = useMemo(() => {
    const stats = new Map<string, { name: string; visits: number; active: number }>();
    
    filteredVisits.forEach((visit) => {
      const dept = visit.department.name;
      const current = stats.get(dept) || { name: dept, visits: 0, active: 0 };
      current.visits += 1;
      if (visit.status === "CHECKED_IN") {
        current.active += 1;
      }
      stats.set(dept, current);
    });

    return Array.from(stats.values())
      .sort((a, b) => b.visits - a.visits); // Sort by most visits
  }, [filteredVisits]);

  const summaryStats = useMemo(() => {
    const stats = {
      total: filteredVisits.length,
      active: filteredVisits.filter((v) => v.status === "CHECKED_IN").length,
      completed: filteredVisits.filter((v) => v.status === "COMPLETED").length,
      pending: filteredVisits.filter((v) => v.status === "APPROVED").length,
    };
    return stats;
  }, [filteredVisits]);

  return (
    <div className="relative">
      <div className="glow-primary -top-10 -left-10" />
      <div className="glow-accent bottom-10 right-10" />
      
      <Card className="glass-card relative z-10">
        <CardHeader>
          <CardTitle>Security Overview</CardTitle>
          <CardDescription>
            Overview of visits across all departments
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
              <p className="text-sm font-medium text-muted-foreground">Pending Check-ins</p>
              <p className="text-2xl font-bold text-foreground">{summaryStats.pending}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="glass-darker p-6 rounded-lg">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    opacity={0.1} 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="name" 
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
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    formatter={(value) => {
                      return value.charAt(0).toUpperCase() + value.slice(1);
                    }}
                  />
                  <Bar 
                    dataKey="visits" 
                    fill={COLORS.visits}
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.8}
                    name="Total Visits"
                  />
                  <Bar 
                    dataKey="active" 
                    fill={COLORS.active}
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.8}
                    name="Active Now"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {departmentStats.map((dept) => (
                <div 
                  key={dept.name}
                  className="glass p-4 rounded-lg text-center"
                >
                  <p className="text-sm font-medium mb-2 text-muted-foreground truncate" title={dept.name}>
                    {dept.name}
                  </p>
                  <div className="space-y-2">
                    <div>
                      <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: COLORS.visits }} />
                      <p className="text-lg font-bold" style={{ color: COLORS.visits }}>
                        {dept.visits}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Visits</p>
                    </div>
                    <div>
                      <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: COLORS.active }} />
                      <p className="text-lg font-bold" style={{ color: COLORS.active }}>
                        {dept.active}
                      </p>
                      <p className="text-xs text-muted-foreground">Active Now</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 