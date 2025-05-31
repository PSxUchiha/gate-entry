import { departments } from "./departments";

export type Role = "SECURITY" | "DEPARTMENT";

export interface User {
  id: string;
  name: string;
  role: Role;
  departmentId?: string;
  username?: string;
  password: string;
}

// Type for client-side user data (excluding sensitive information)
export interface ClientUser {
  id: string;
  name: string;
  role: Role;
  departmentId?: string;
}

// In a real app, these would be hashed and stored in a database
export const USERS: User[] = [
  {
    id: "security_1",
    name: "Security Team",
    username: "security",
    password: "security123",
    role: "SECURITY" as const,
  },
  {
    id: "rd_1",
    name: "R&D Department",
    password: "rd123",
    role: "DEPARTMENT" as const,
    departmentId: "rd",
  },
  {
    id: "steel_1",
    name: "Steel Production",
    password: "steel123",
    role: "DEPARTMENT" as const,
    departmentId: "steel_prod",
  },
  {
    id: "quality_1",
    name: "Quality Control",
    password: "quality123",
    role: "DEPARTMENT" as const,
    departmentId: "quality",
  },
  {
    id: "hr_1",
    name: "HR Department",
    password: "hr123",
    role: "DEPARTMENT" as const,
    departmentId: "hr",
  },
  {
    id: "automation_1",
    name: "Process Automation",
    password: "automation123",
    role: "DEPARTMENT" as const,
    departmentId: "automation",
  },
];

export function validateCredentials(username: string, password: string) {
  return USERS.find(
    (user) => user.username === username && user.password === password
  );
}

// Get department name from ID
export function getDepartmentName(departmentId: string) {
  return departments.find((dept) => dept.id === departmentId)?.name || departmentId;
} 