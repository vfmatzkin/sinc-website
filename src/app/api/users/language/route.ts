import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { Language } from '@prisma/client';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ language: 'EN' });
  }

  try {
    const userLanguage = await prisma.userLanguage.findUnique({
      where: { userId: session.user.id },
    });
    
    return NextResponse.json({ language: userLanguage?.language || 'EN' });
  } catch (error) {
    console.error('Language fetch error:', error);
    return NextResponse.json({ language: 'EN' });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { language } = await request.json() as { language: Language };
    
    // Upsert to handle both creation and updates
    const userLanguage = await prisma.userLanguage.upsert({
      where: { userId: session.user.id },
      update: { language },
      create: {
        userId: session.user.id,
        language,
      },
    });

    return NextResponse.json(userLanguage);
  } catch (error) {
    console.error('Language update error:', error);
    return NextResponse.json({ error: 'Language update failed' }, { status: 500 });
  }
}