import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { StaffProfile } from './StaffProfile';

export default async function StaffMemberPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const member = await prisma.user.findUnique({
    where: {
      id: params.id,
      staffVerificationStatus: 'VERIFIED',
      isActive: true,
    },
    include: {
      profile: true,
      positions: true,
      researchLines: true,
      publications: {
        orderBy: {
          year: 'desc',
        },
      },
    },
  });

  if (!member) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StaffProfile member={member} />
    </div>
  );
}