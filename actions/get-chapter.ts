import { db } from "@/lib/db";
import {
  purchases,
  courses,
  chapters,
  attachments,
  muxData,
  userProgress,
  categories,
} from "@/db/schema";
import { eq, and, gt, asc } from "drizzle-orm";
import { Attachment, Chapter } from "@/db/schema";

interface getChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: getChapterProps) => {
  try {
    const [purchase] = await db
      .select()
      .from(purchases)
      .where(
        and(eq(purchases.userId, userId), eq(purchases.courseId, courseId))
      )
      .limit(1);

    const [course] = await db
      .select({
        price: courses.price,
        description: courses.description,
        categoryId: courses.categoryId,
      })
      .from(courses)
      .where(and(eq(courses.isPublished, true), eq(courses.id, courseId)))
      .limit(1);

    const [chapter] = await db
      .select()
      .from(chapters)
      .where(and(eq(chapters.id, chapterId), eq(chapters.isPublished, true)))
      .limit(1);

    if (!chapter || !course) {
      throw new Error("Chapter or course not found");
    }

    let categoryName: string | null = null;
    if (course.categoryId) {
      const [category] = await db
        .select({ name: categories.name })
        .from(categories)
        .where(eq(categories.id, course.categoryId))
        .limit(1);
      categoryName = category?.name || null;
    }

    let muxDataResult = null;
    let attachmentsList: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    attachmentsList = await db
      .select()
      .from(attachments)
      .where(eq(attachments.courseId, courseId));

    if (chapter.isFree || purchase) {
      const [muxDataItem] = await db
        .select()
        .from(muxData)
        .where(eq(muxData.chapterId, chapterId))
        .limit(1);

      muxDataResult = muxDataItem || null;

      const nextChapters = await db
        .select()
        .from(chapters)
        .where(
          and(
            eq(chapters.courseId, courseId),
            eq(chapters.isPublished, true),
            gt(chapters.position, chapter.position)
          )
        )
        .orderBy(asc(chapters.position))
        .limit(1);

      nextChapter = nextChapters[0] || null;
    }

    const [userProgressResult] = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.chapterId, chapterId)
        )
      )
      .limit(1);

    return {
      chapter,
      course: {
        ...course,
        categoryName,
      },
      muxData: muxDataResult,
      attachments: attachmentsList,
      nextChapter,
      userProgress: userProgressResult || null,
      purchase: purchase || null,
    };
  } catch (error) {
    console.log(error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};
