import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import type { StaffVerificationStatus } from '@prisma/client';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { 
      phone, 
      institution, 
      department, 
      isStaff,
      firstName,
      lastName,
      bio,
      website,
      employeeId,
      officeNumber 
    } = await request.json();

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: `${firstName} ${lastName}`, // Combine first and last name
        phone,
        institution,
        department,
        bio,
        registrationComplete: false,
        staffVerificationStatus: isStaff ? 'UNVERIFIED' as StaffVerificationStatus : undefined
      }
    });

    // Update or create profile
    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        customLinks: website ? { website } : undefined
      },
      update: {
        customLinks: website ? { website } : undefined
      }
    });

    return NextResponse.json({ ...updatedUser, profile });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}