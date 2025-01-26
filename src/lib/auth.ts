import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@prisma/client";

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    return session?.user || null;
  } catch (error) {
    console.error("Error retrieving current user session:", error);
    return null;
  }
}

export async function checkUserRole(requiredRole: Role) {
  const user = await getCurrentUser();
  if (!user) return false;

  // Admin has access to everything
  if (user.role === 'ADMIN') return true;

  return user.role === requiredRole;
}

export async function checkVerifiedStaff() {
  const user = await getCurrentUser();
  if (!user) return false;

  return user.staffStatus === 'VERIFIED';
}
