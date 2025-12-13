import { auth, currentUser } from "@clerk/nextjs/server";
import { SafeProfile } from "@/types";

export async function getProfile(): Promise<SafeProfile | null> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const user = await currentUser();
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      userId: user.id,
      role: (user.publicMetadata?.role as SafeProfile["role"]) || "STUDENT",
      email: user.emailAddresses[0]?.emailAddress || "",
      name:
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.firstName || null,
      imageUrl: user.imageUrl,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error getting profile:", error);
    return null;
  }
}
