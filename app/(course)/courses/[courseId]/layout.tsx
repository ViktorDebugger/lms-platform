import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { courses, chapters, userProgress, purchases } from "@/db/schema";
import { eq, and, asc, inArray } from "drizzle-orm";

import { getProgress } from "@/actions/get-progress";

import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";
import getSafeProfile from "@/actions/get-safe-profile";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const safeProfile = await getSafeProfile();
  if (!safeProfile) {
    return redirect("/");
  }

  const { courseId } = await params;

  const [courseData] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  if (!courseData) {
    return redirect("/");
  }

  const chaptersList = await db
    .select()
    .from(chapters)
    .where(and(eq(chapters.courseId, courseId), eq(chapters.isPublished, true)))
    .orderBy(asc(chapters.position));

  const chapterIds = chaptersList.map((ch) => ch.id);
  const userProgressList =
    chapterIds.length > 0
      ? await db
          .select()
          .from(userProgress)
          .where(
            and(
              eq(userProgress.userId, userId),
              inArray(userProgress.chapterId, chapterIds)
            )
          )
      : [];

  const progressByChapter = new Map(
    userProgressList.map((up) => [up.chapterId, up])
  );

  const chaptersWithProgress = chaptersList.map((chapter) => ({
    ...chapter,
    userProgress: progressByChapter.has(chapter.id)
      ? [progressByChapter.get(chapter.id)!]
      : null,
  }));

  const course = {
    ...courseData,
    chapters: chaptersWithProgress,
  };

  const progressCount: number = (await getProgress(userId, course.id)) || 0;

  const [purchase] = await db
    .select()
    .from(purchases)
    .where(and(eq(purchases.userId, userId), eq(purchases.courseId, course.id)))
    .limit(1);

  const hasPurchase = !!purchase;

  return (
    <div className="h-full">
      <div className="fixed top-0 right-0 left-0 z-50 h-[80px] w-full bg-white dark:bg-gray-900">
        <CourseNavbar
          course={course}
          progressCount={progressCount}
          currentProfile={safeProfile}
          hasPurchase={hasPurchase}
        />
      </div>
      <div className="fixed inset-y-0 left-0 z-40 hidden h-full w-80 flex-col bg-gradient-to-b from-purple-50/50 via-white to-violet-50/50 shadow-sm backdrop-blur-sm md:flex dark:from-gray-950 dark:via-purple-950/20 dark:to-violet-950/30">
        <CourseSidebar
          course={course}
          progressCount={progressCount}
          hasPurchase={hasPurchase}
        />
      </div>
      <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-gradient-to-b from-purple-100 via-purple-50 to-white pt-[80px] md:pl-80 dark:from-gray-950 dark:via-purple-950/30 dark:to-gray-900">
        <div className="h-full w-full">{children}</div>
      </main>
    </div>
  );
};

export default CourseLayout;
