import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        deletionRequestedAt: new Date(),
        deletionRequester: { connect: { id: session.user.id } }
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Deletion request error:', error);
    return NextResponse.json({ error: 'Deletion request failed' }, { status: 500 });
  }
}