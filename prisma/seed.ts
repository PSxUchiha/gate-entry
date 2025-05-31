import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const departments = [
  {
    id: "rd",
    name: "Research & Development",
  },
  {
    id: "steel_prod",
    name: "Steel Production",
  },
  {
    id: "quality",
    name: "Quality Control",
  },
  {
    id: "hr",
    name: "Human Resources",
  },
  {
    id: "automation",
    name: "Process Automation",
  },
] as const;

async function main() {
  // Create departments
  for (const dept of departments) {
    await prisma.department.upsert({
      where: { id: dept.id },
      update: { name: dept.name },
      create: {
        id: dept.id,
        name: dept.name,
      },
    });
  }

  // Create employees
  const employees = [
    {
      name: 'John Smith',
      email: 'john.smith@rd.company.com',
      phone: '+1234567890',
      departmentId: 'rd',
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@steel_prod.company.com',
      phone: '+1234567891',
      departmentId: 'steel_prod',
    },
    {
      name: 'Michael Brown',
      email: 'michael.brown@quality.company.com',
      phone: '+1234567892',
      departmentId: 'quality',
    },
    {
      name: 'Emily Davis',
      email: 'emily.davis@hr.company.com',
      phone: '+1234567893',
      departmentId: 'hr',
    },
    {
      name: 'David Wilson',
      email: 'david.wilson@automation.company.com',
      phone: '+1234567894',
      departmentId: 'automation',
    },
  ];

  for (const employee of employees) {
    await prisma.employee.upsert({
      where: { email: employee.email },
      update: {
        name: employee.name,
        phone: employee.phone,
        departmentId: employee.departmentId,
      },
      create: {
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        departmentId: employee.departmentId,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 