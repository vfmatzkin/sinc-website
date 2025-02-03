import { DefaultUser } from 'next-auth';
import { Role, StaffVerificationStatus } from '@prisma/client';

declare module 'next-auth' {
  interface User extends DefaultUser {
    role: Role;
    staffVerificationStatus: StaffVerificationStatus;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      image?: string;
      staffStatus: StaffVerificationStatus;
      languagePreference: string;
    };
  }
}