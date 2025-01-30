import { type FormerPosition, type Profile, type Publication, type ResearchLine, type User, type UserPosition } from '@prisma/client';
import Link from 'next/link';
import { ProfileImage } from './ProfileImage';

type StaffProfileProps = {
  member: User & {
    name?: string | null;
    image?: string | null;
    positions: UserPosition[];
    researchLines: ResearchLine[];
    publications: Publication[];
    profile: Profile | null;
    formerPositions: FormerPosition[];
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
        {/* Header with image and name */}
        <div className="flex items-center space-x-6 mb-8">
          {member.image && (
            <ProfileImage 
              src={member.image}
              alt={member.name || 'Staff member'}
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {member.name}
            </h1>
            {/* Current Positions */}
            <div className="text-lg text-gray-600 dark:text-gray-300">
              {member.positions.map((userPosition) => (
                <div key={userPosition.id}>
                  {userPosition.position}
                </div>
              ))}
            </div>
            {/* Former Positions */}
            {member.formerPositions && member.formerPositions.length > 0 && (
              <div className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                <span className="font-semibold">Former Positions:</span>
                {member.formerPositions.map((formerPosition) => (
                  <div key={formerPosition.id}>
                    {formerPosition.position}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bio/About */}
        {member.bio && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              About
            </h2>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {member.bio}
            </p>
          </div>
        )}

        {/* Contact and Professional Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Professional Links
          </h2>
          {member.profile?.googleScholar && (
            <a
              href={member.profile.googleScholar}
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Google Scholar
            </a>
          )}
          {member.profile?.orcid && (
            <a
              href={`https://orcid.org/${member.profile.orcid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              ORCID
            </a>
          )}
          {member.profile?.researchGate && (
            <a
              href={member.profile.researchGate}
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              ResearchGate
            </a>
          )}
        </div>

        {/* Research Areas */}
        {member.researchLines.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Research Areas
            </h2>
            <div className="flex flex-wrap gap-2">
              {member.researchLines.map((line) => (
                <span
                  key={line.id}
                  className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                >
                  {line.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Publications */}
        {/* ...existing code... */}
      </div>
    </div>
  );
}