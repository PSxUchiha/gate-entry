"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Visit, Visitor, Employee, Department } from "@prisma/client";
import { cn } from "@/lib/utils";

interface VisitWithRelations extends Visit {
  visitor: Visitor;
  employee: Employee;
  department: Department;
}

interface ActivityFiltersProps {
  visits: VisitWithRelations[];
  onDateRangeChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

export function ActivityFilters({ visits, onDateRangeChange }: ActivityFiltersProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleDateSelect = (date: Date | undefined) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(undefined);
    } else {
      if (date && date >= startDate) {
        setEndDate(date);
        onDateRangeChange(startDate, date);
      } else if (date) {
        setStartDate(date);
        setEndDate(undefined);
      }
    }
  };

  const clearDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onDateRangeChange(undefined, undefined);
  };

  const exportData = (exportFormat: "csv" | "pdf") => {
    // Filter visits by date range if set
    let filteredVisits = [...visits];
    if (startDate && endDate) {
      filteredVisits = visits.filter(visit => {
        const visitDate = new Date(visit.createdAt);
        return visitDate >= startDate && visitDate <= endDate;
      });
    }

    if (exportFormat === "csv") {
      // Create CSV content
      const headers = ["Visitor", "Company", "Employee", "Department", "Purpose", "Status", "Date"];
      const rows = filteredVisits.map(visit => [
        visit.visitor.name,
        visit.visitor.company || "N/A",
        visit.employee.name,
        visit.department.name,
        visit.purpose,
        visit.status,
        new Date(visit.createdAt).toLocaleString()
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");

      // Create and download the file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `visitor_data_${format(new Date(), "yyyy-MM-dd")}.csv`;
      link.click();
    } else {
      // For PDF, we'll use the browser's print functionality
      // Create a temporary div with formatted content
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = `
        <h1>Visitor Data Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        ${startDate && endDate ? `<p>Date Range: ${format(startDate, "LLL dd, y")} - ${format(endDate, "LLL dd, y")}</p>` : ""}
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Visitor</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Company</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Employee</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Department</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Status</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${filteredVisits.map(visit => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${visit.visitor.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${visit.visitor.company || "N/A"}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${visit.employee.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${visit.department.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${visit.status}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${new Date(visit.createdAt).toLocaleString()}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;

      // Open print dialog
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Visitor Data Report</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                @media print {
                  body { padding: 0; }
                }
              </style>
            </head>
            <body>${tempDiv.innerHTML}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal glass-input",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                endDate ? (
                  <>
                    {format(startDate, "LLL dd, y")} - {format(endDate, "LLL dd, y")}
                  </>
                ) : (
                  format(startDate, "LLL dd, y")
                )
              ) : (
                "Select date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="glass-popover p-0" align="start">
            <div className="glass-darker p-2 rounded-lg">
              <Calendar
                initialFocus
                mode="single"
                selected={startDate}
                onSelect={handleDateSelect}
                numberOfMonths={1}
                className="rounded-lg"
              />
            </div>
          </PopoverContent>
        </Popover>
        {(startDate || endDate) && (
          <Button
            variant="ghost"
            className="glass hover:glass-darker"
            onClick={clearDates}
          >
            Clear
          </Button>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => exportData("csv")}>
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportData("pdf")}>
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 