import { NextResponse } from 'next/server';
import { getContent } from '@/lib/content';
import { Language } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const lang = (searchParams.get('lang') as Language) || 'EN';

  if (!key) {
    return NextResponse.json({ error: 'Key is required' }, { status: 400 });
  }

  try {
    const content = await getContent(key, lang);
    return NextResponse.json({ content: content || key });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ content: key }, { status: 500 });
  }
}