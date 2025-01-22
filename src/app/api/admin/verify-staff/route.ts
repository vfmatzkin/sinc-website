import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { StaffVerificationStatus } from '@/types/enums';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Ensure only admin can verify
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { userId, status } = await request.json() as {
      userId: string;
      status: StaffVerificationStatus;
    };
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        staffVerificationStatus: status,
        staffVerifiedBy: { connect: { id: session.user.id } },
        staffVerificationDate: new Date()
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Staff verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}