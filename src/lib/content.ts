import { Language } from '@prisma/client';

import prisma from './prisma';

export async function getContent(key: string, language: Language = 'EN') {
  const content = await prisma.content.findUnique({
    where: { key },
    include: {
      translations: {
        where: { language },
      },
    },
  });

  // If no translation exists for requested language, fall back to English
  if (content?.translations.length === 0 && language !== 'EN') {
    return getContent(key, 'EN');
  }

  return content?.translations[0]?.value;
}

export async function getUserLanguage(userId: string): Promise<Language> {
  const userLanguage = await prisma.userLanguage.findUnique({
    where: { userId },
  });
  
  return userLanguage?.language || 'EN';
}