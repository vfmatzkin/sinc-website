import Link from 'next/link';
import Image from 'next/image';
import { type User, type Profile, type UserPosition, type ResearchLine } from '@prisma/client';

type StaffCardProps = {
  member: User & {
    positions: UserPosition[];
    researchLines: ResearchLine[];
    profile: Profile | null;
  };
};

export function StaffCard({ member }: StaffCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        {member.image && (
          <Image 
            src={member.image} 
            alt={member.name || 'Staff member'} 
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
        )}
        <div>
          <Link 
            href={`/staff/${member.id}`}
            className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
          >
            {member.name}
          </Link>
          {member.positions.map((userPosition) => (
            <div 
              key={userPosition.id}
              className="text-sm text-gray-600 dark:text-gray-300"
            >
              {userPosition.position}
            </div>
          ))}
        </div>
      </div>

      {member.profile?.title && (
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {member.profile.title}
        </p>
      )}

      {member.researchLines.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Research Areas
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {member.researchLines.map((line) => (
              <span
                key={line.id}
                className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              >
                {line.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex space-x-4">
        {member.profile?.googleScholar && (
          <a
            href={member.profile.googleScholar}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Google Scholar
          </a>
        )}
        {member.profile?.orcid && (
          <a
            href={`https://orcid.org/${member.profile.orcid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ORCID
          </a>
        )}
      </div>
    </div>
  );
}