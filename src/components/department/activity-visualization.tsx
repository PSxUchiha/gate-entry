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
  employees: "rgb(189, 147, 249)", // Dracula Purple
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

  const dailyStats = useMemo(() => {
    const stats = new Map<string, { date: string; visits: number; employees: number }>();
    
    filteredVisits.forEach((visit) => {
      const date = new Date(visit.createdAt).toLocaleDateString();
      const current = stats.get(date) || { date, visits: 0, employees: 0 };
      current.visits += 1;
      
      // Count unique employees per day
      const employeeStats = new Set(
        filteredVisits
          .filter(v => new Date(v.createdAt).toLocaleDateString() === date)
          .map(v => v.employeeId)
      );
      current.employees = employeeStats.size;
      
      stats.set(date, current);
    });

    return Array.from(stats.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days
  }, [filteredVisits]);

  const summaryStats = useMemo(() => {
    const uniqueEmployees = new Set(filteredVisits.map(v => v.employeeId));
    
    return {
      total: filteredVisits.length,
      active: filteredVisits.filter((v) => v.status === "CHECKED_IN").length,
      completed: filteredVisits.filter((v) => v.status === "COMPLETED").length,
      uniqueEmployees: uniqueEmployees.size,
    };
  }, [filteredVisits]);

  return (
    <div className="relative">
      <div className="glow-primary -top-10 -left-10" />
      <div className="glow-accent bottom-10 right-10" />
      
      <Card className="glass-card relative z-10">
        <CardHeader>
          <CardTitle>Department Activity</CardTitle>
          <CardDescription>
            Overview of visits and employee engagement
          </CardDescription>
          <ActivityFilters visits={filteredVisits} onDateRangeChange={handleDateRangeChange} />
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="glass-darker p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
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
              <p className="text-sm font-medium text-muted-foreground">Active Employees</p>
              <p className="text-2xl font-bold text-foreground">{summaryStats.uniqueEmployees}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="glass-darker p-6 rounded-lg">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    opacity={0.1} 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="date" 
                    stroke="currentColor" 
                    opacity={0.7}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
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
                    name="Visits"
                  />
                  <Bar 
                    dataKey="employees" 
                    fill={COLORS.employees}
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.8}
                    name="Employees"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dailyStats.map((day) => (
                <div 
                  key={day.date}
                  className="glass p-4 rounded-lg text-center"
                >
                  <p className="text-sm font-medium mb-2 text-muted-foreground">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <div className="space-y-2">
                    <div>
                      <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: COLORS.visits }} />
                      <p className="text-lg font-bold" style={{ color: COLORS.visits }}>
                        {day.visits}
                      </p>
                      <p className="text-xs text-muted-foreground">Visits</p>
                    </div>
                    <div>
                      <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: COLORS.employees }} />
                      <p className="text-lg font-bold" style={{ color: COLORS.employees }}>
                        {day.employees}
                      </p>
                      <p className="text-xs text-muted-foreground">Employees</p>
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