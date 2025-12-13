import { SafeProfile } from "@/types";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function getSafeProfile() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const user = await currentUser();
    if (!user) {
      return null;
    }

    const safeProfile: SafeProfile = {
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

    return safeProfile;
  } catch (error: any) {
    return null;
  }
}
