import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { courses, categories, chapters, purchases } from "@/db/schema";
import { eq, and, desc, inArray, sql } from "drizzle-orm";
import { CourseWithProgressWithCategory } from "@/types";

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const conditions = [eq(courses.isPublished, true)];

    if (title) {
      conditions.push(
        sql`to_tsvector('english', ${courses.title}) @@ plainto_tsquery('english', ${title})`
      );
    }

    if (categoryId) {
      conditions.push(eq(courses.categoryId, categoryId));
    }

    const coursesList = await db
      .select({
        course: courses,
        category: categories,
      })
      .from(courses)
      .leftJoin(categories, eq(courses.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(desc(courses.createdAt));

    const courseIds = coursesList.map((c) => c.course.id);
    const publishedChapters = await db
      .select()
      .from(chapters)
      .where(
        and(
          inArray(chapters.courseId, courseIds),
          eq(chapters.isPublished, true)
        )
      );

    const userPurchases = await db
      .select()
      .from(purchases)
      .where(eq(purchases.userId, userId));

    const purchaseMap = new Map(userPurchases.map((p) => [p.courseId, p]));

    const chaptersByCourse = new Map<string, typeof publishedChapters>();
    publishedChapters.forEach((chapter) => {
      const existing = chaptersByCourse.get(chapter.courseId) || [];
      existing.push(chapter);
      chaptersByCourse.set(chapter.courseId, existing);
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        coursesList.map(async (item) => {
          const courseChapters = chaptersByCourse.get(item.course.id) || [];
          const hasPurchase = purchaseMap.has(item.course.id);

          let progress: number | null = null;
          if (hasPurchase) {
            progress = await getProgress(userId, item.course.id);
          }

          return {
            ...item.course,
            category: item.category,
            chapters: courseChapters,
            progress,
          };
        })
      );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
