import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { phone, institution, department, isStaff } = await request.json();
    
    const updateData: Prisma.UserUpdateInput = {
      phone: phone || null,
      institution: institution || null,
      department: department || null,
      staffVerificationStatus: isStaff ? 'PENDING' : 'UNVERIFIED'
    };

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}