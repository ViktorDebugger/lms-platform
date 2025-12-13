import { auth, currentUser } from "@clerk/nextjs/server";
import { SafeProfile } from "@/types";

export const isTeacher = async (userId?: string) => {
  try {
    let user;

    if (userId) {
      const { userId: currentUserId } = await auth();
      if (currentUserId !== userId) {
        return false;
      }
      user = await currentUser();
    } else {
      const { userId: currentUserId } = await auth();
      if (!currentUserId) {
        return false;
      }
      user = await currentUser();
    }

    if (!user) {
      return false;
    }

    const role =
      (user.publicMetadata?.role as SafeProfile["role"]) || "STUDENT";
    const isAuthorized = role === "ADMIN" || role === "TEACHER";

    console.log("teacher.ts_IsTeacher: ", isAuthorized);
    return isAuthorized;
  } catch (error) {
    console.error("Error checking if user is teacher:", error);
    return false;
  }
};
