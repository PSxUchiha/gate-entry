"use client";

import { VisitWithRelations } from "@/types/visit";
import { VisitStatus } from "@/components/visit/visit-status";
import { SecurityActions } from "@/components/security/security-actions";
import { BaseVisitTable } from "@/components/visit/base-visit-table";

export function SecurityVisitTable({ visits }: { visits: VisitWithRelations[] }) {
  const columns = [
    {
      key: "visitor",
      header: "Visitor",
      render: (visit: VisitWithRelations) => (
        <div>
          {visit.visitor.name}
          {visit.visitor.company && (
            <div className="text-sm text-muted-foreground">{visit.visitor.company}</div>
          )}
        </div>
      ),
    },
    {
      key: "employee",
      header: "Employee",
      render: (visit: VisitWithRelations) => visit.employee.name,
    },
    {
      key: "department",
      header: "Department",
      render: (visit: VisitWithRelations) => visit.department.name,
    },
    {
      key: "purpose",
      header: "Purpose",
      render: (visit: VisitWithRelations) => visit.purpose,
    },
    {
      key: "time",
      header: "Time",
      render: (visit: VisitWithRelations) => new Date(visit.createdAt).toLocaleString(),
    },
    {
      key: "status",
      header: "Status",
      render: (visit: VisitWithRelations) => <VisitStatus status={visit.status} />,
    },
  ];

  return (
    <BaseVisitTable
      visits={visits}
      columns={columns}
      actions={(visit: VisitWithRelations) => <SecurityActions visit={visit} />}
    />
  );
} 