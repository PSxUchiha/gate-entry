import { useEffect, useState } from 'react';
import { VisitWithRelations } from '@/types/visit';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VisitStatus } from "@/components/visit/visit-status";
import { VisitActions } from "@/components/visit/visit-actions";

export function VisitTable({ visits }: { visits: VisitWithRelations[] }) {
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
            <TableHead>Visitor</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visits.map((visit) => (
            <TableRow key={visit.id}>
              <TableCell>{visit.visitor.name}</TableCell>
              <TableCell>{visit.visitor.company}</TableCell>
              <TableCell>{visit.purpose}</TableCell>
              <TableCell>
                {mounted ? new Date(visit.createdAt).toLocaleString() : ''}
              </TableCell>
              <TableCell>
                <VisitStatus status={visit.status} />
              </TableCell>
              <TableCell>
                <VisitActions visit={visit} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 