import Image from 'next/image';
import Link from 'next/link';
import { type User, type Profile, type UserPosition, type ResearchLine, type Publication } from '@prisma/client';

type StaffProfileProps = {
  member: User & {
    name?: string | null;
    image?: string | null;
    positions: UserPosition[];
    researchLines: ResearchLine[];
    publications: Publication[];
    profile: Profile | null;
  };
};

export function StaffProfile({ member }: StaffProfileProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        href="/staff"
        className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block"
      >
        ← Back to Staff Directory
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        {/* Rest of your profile content */}
      </div>
    </div>
  );
}