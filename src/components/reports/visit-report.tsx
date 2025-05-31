"use client"

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

type Visit = {
  id: string;
  visitorName: string;
  visitorType: "INTERNAL" | "EXTERNAL";
  company?: string;
  purpose: string;
  status: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  department: string;
};

type VisitReportProps = {
  visits: Visit[];
};

export function VisitReport({ visits }: VisitReportProps) {
  const [isOpen, setIsOpen] = useState(false);

  const todayVisits = visits.filter((visit) => {
    if (!visit.checkInTime) return false;
    const visitDate = new Date(visit.checkInTime);
    const today = new Date();
    return (
      visitDate.getDate() === today.getDate() &&
      visitDate.getMonth() === today.getMonth() &&
      visitDate.getFullYear() === today.getFullYear()
    );
  });

  const formatTime = (date: Date | undefined) => {
    if (!date) return "N/A";
    return format(new Date(date), "hh:mm a");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>View Daily Report</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Daily Visit Report</DialogTitle>
          <DialogDescription>
            Showing all visits for {format(new Date(), "MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Visitor</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Check In</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Check Out</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {todayVisits.map((visit) => (
                  <tr key={visit.id}>
                    <td className="px-4 py-3 text-sm">
                      {visit.visitorName}
                      {visit.company && (
                        <div className="text-xs text-muted-foreground">
                          {visit.company}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">{visit.visitorType}</td>
                    <td className="px-4 py-3 text-sm">{visit.department}</td>
                    <td className="px-4 py-3 text-sm">
                      {formatTime(visit.checkInTime)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatTime(visit.checkOutTime)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-muted">
                        {visit.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {todayVisits.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No visits recorded today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Total Visits Today: {todayVisits.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 