import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { purchases } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Course, Chapter, UserProgress } from "@/db/schema";
import { CourseProgress } from "@/components/course-progress";

import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseSidebarContent } from "./course-sidebar-content";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
  hasPurchase?: boolean;
}

export const CourseSidebar = async ({
  course,
  progressCount,
  hasPurchase,
}: CourseSidebarProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  let purchase = null;
  if (hasPurchase === undefined) {
    const [purchaseData] = await db
      .select()
      .from(purchases)
      .where(
        and(eq(purchases.userId, userId), eq(purchases.courseId, course.id))
      )
      .limit(1);
    purchase = purchaseData;
  } else {
    purchase = hasPurchase ? {} : null;
  }

  return (
    <CourseSidebarContent
      course={course}
      progressCount={progressCount}
      hasPurchase={!!purchase}
    />
  );
};
