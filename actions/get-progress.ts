import { db } from "@/lib/db";
import { chapters, userProgress } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number | null> => {
  try {
    const publishedChapters = await db
      .select({ id: chapters.id })
      .from(chapters)
      .where(
        and(eq(chapters.courseId, courseId), eq(chapters.isPublished, true))
      );

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    if (publishedChapterIds.length === 0) {
      return 0;
    }

    const validCompletedChapters = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          inArray(userProgress.chapterId, publishedChapterIds),
          eq(userProgress.isCompleted, true)
        )
      );

    const progressPercentage =
      (validCompletedChapters.length / publishedChapters.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
