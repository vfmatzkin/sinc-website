import 'next-auth';
import { Role, StaffVerificationStatus } from '@prisma/client';

declare module 'next-auth' {
  interface User {
    role: Role;
    staffVerificationStatus: StaffVerificationStatus;
  }

  interface Session {
    user: User & {
      id: string;
    };
  }
}