import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { sendNotification } from '@/lib/notifications';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status } = body;

    const visit = await prisma.visit.update({
      where: {
        id: params.id,
      },
      data: {
        status,
        ...(status === 'APPROVED' && { approvalTime: new Date() }),
        ...(status === 'CHECKED_IN' && { checkInTime: new Date() }),
        ...(status === 'COMPLETED' && { checkOutTime: new Date() }),
      },
      include: {
        visitor: true,
        employee: true,
        department: true,
      },
    });

    // Send notification in the background
    const message = `Your visit status has been updated to: ${status}${
      status === "APPROVED" ? `\nYour unique code is: ${visit.uniqueCode}` : ''
    }`;

    sendNotification({
      email: visit.visitor.email,
      phone: visit.visitor.phone,
      subject: "Visit Status Update",
      message,
    }).catch(console.error);

    return NextResponse.json(visit);
  } catch (error) {
    console.error('Error updating visit:', error);
    return NextResponse.json(
      { error: 'Failed to update visit' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const visit = await prisma.visit.findUnique({
      where: {
        id: params.id,
      },
      include: {
        visitor: true,
        employee: true,
        department: true,
      },
    });

    if (!visit) {
      return NextResponse.json(
        { error: 'Visit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(visit);
  } catch (error) {
    console.error('Error fetching visit:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visit' },
      { status: 500 }
    );
  }
} 