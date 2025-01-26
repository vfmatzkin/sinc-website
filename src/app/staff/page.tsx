import prisma from '@/lib/prisma';
import { StaffCard } from '@/components/staff/StaffCard';

export default async function StaffDirectoryPage() {
  const verifiedStaff = await prisma.user.findMany({
    where: {
      staffVerificationStatus: 'VERIFIED',
      isActive: true,
    },
    include: {
      profile: true,
      positions: true,
      researchLines: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Staff Directory
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {verifiedStaff.map((member) => (
          <StaffCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}