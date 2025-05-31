import { Visit, Visitor, Employee, Department } from '@prisma/client';

export interface VisitWithRelations extends Visit {
  visitor: Visitor;
  employee: Employee;
  department: Department;
}

export interface VisitStatusProps {
  status: string;
  isOverstayed?: boolean;
} 