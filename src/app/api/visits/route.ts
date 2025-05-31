import { NextResponse } from "next/server";
import { generateUniqueCode } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import { sendNotification } from '@/lib/notifications';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      visitorName,
      visitorEmail,
      visitorPhone,
      visitorCompany,
      visitorType,
      employeeId,
      departmentId,
      purpose,
      timeAllotted,
    } = body;

    // Create or get existing visitor
    const visitor = await prisma.visitor.upsert({
      where: {
        email: visitorEmail,
      },
      update: {
        name: visitorName,
        phone: visitorPhone,
        company: visitorCompany,
        type: visitorType,
      },
      create: {
        name: visitorName,
        email: visitorEmail,
        phone: visitorPhone,
        company: visitorCompany,
        type: visitorType,
      },
    });

    // Get employee details for notification
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: { email: true, phone: true },
    });

    // Create visit request
    const visit = await prisma.visit.create({
      data: {
        visitorId: visitor.id,
        employeeId,
        departmentId,
        purpose,
        timeAllotted,
        uniqueCode: generateUniqueCode(),
        status: 'PENDING',
      },
      include: {
        visitor: true,
        employee: true,
        department: true,
      },
    });

    // Send notifications in the background
    if (employee) {
      sendNotification({
        email: employee.email,
        phone: employee.phone || '',
        subject: "New Visitor Registration",
        message: `A new visitor (${visitorName}) has registered to meet you. Please approve or reject the visit.`,
      }).catch(console.error);
    }

    return NextResponse.json(visit);
  } catch (error) {
    console.error('Error creating visit:', error);
    return NextResponse.json(
      { error: 'Failed to create visit request' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get('departmentId');
    const status = searchParams.get('status');

    const where: any = {};
    if (departmentId) {
      where.departmentId = departmentId;
    }
    if (status) {
      where.status = status;
    }

    const visits = await prisma.visit.findMany({
      where,
      include: {
        visitor: true,
        employee: true,
        department: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(visits);
  } catch (error) {
    console.error('Error fetching visits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visits' },
      { status: 500 }
    );
  }
} 