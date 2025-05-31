export const departments = [
  {
    id: "rd",
    name: "Research & Development",
    description: "Advanced materials and process research",
    color: "blue",
  },
  {
    id: "steel_prod",
    name: "Steel Production",
    description: "Primary steel manufacturing unit",
    color: "orange",
  },
  {
    id: "quality",
    name: "Quality Control",
    description: "Material testing and quality assurance",
    color: "green",
  },
  {
    id: "hr",
    name: "Human Resources",
    description: "Personnel management and recruitment",
    color: "purple",
  },
  {
    id: "automation",
    name: "Process Automation",
    description: "Manufacturing automation and control systems",
    color: "red",
  },
] as const;

export type DepartmentId = typeof departments[number]["id"]; 