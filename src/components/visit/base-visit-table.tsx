"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VisitStatus } from "@/components/visit/visit-status";

interface BaseVisitTableProps {
  visits: any[];
  columns: {
    key: string;
    header: string;
    render: (visit: any) => React.ReactNode;
  }[];
  actions?: (visit: any) => React.ReactNode;
}

export function BaseVisitTable({ visits, columns, actions }: BaseVisitTableProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key}>{column.header}</TableCell>
            ))}
            {actions && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visits.map((visit) => (
            <TableRow key={visit.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>{column.render(visit)}</TableCell>
              ))}
              {actions && <TableCell>{actions(visit)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 