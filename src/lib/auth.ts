import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function getCurrentUser() {
  try {
    // Explicitly import and use authOptions
    const session = await getServerSession(authOptions);
    return session?.user || null;
  } catch (error) {
    console.error("Error retrieving current user session:", error);
    return null;
  }
}