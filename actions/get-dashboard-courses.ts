import { db } from "@/lib/db";
import { purchases, courses, categories, chapters } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { getProgress } from "./get-progress";
import { CourseWithProgressWithCategory } from "@/types";

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await db
      .select({
        purchase: purchases,
        course: courses,
        category: categories,
      })
      .from(purchases)
      .innerJoin(courses, eq(purchases.courseId, courses.id))
      .leftJoin(categories, eq(courses.categoryId, categories.id))
      .where(eq(purchases.userId, userId));

    const courseIds = purchasedCourses.map((pc) => pc.course.id);
    const publishedChapters =
      courseIds.length > 0
        ? await db
            .select()
            .from(chapters)
            .where(
              and(
                eq(chapters.isPublished, true),
                inArray(chapters.courseId, courseIds)
              )
            )
        : [];

    const chaptersByCourse = new Map<string, typeof publishedChapters>();
    publishedChapters.forEach((chapter) => {
      const existing = chaptersByCourse.get(chapter.courseId) || [];
      existing.push(chapter);
      chaptersByCourse.set(chapter.courseId, existing);
    });

    const coursesList: CourseWithProgressWithCategory[] = await Promise.all(
      purchasedCourses.map(async (item) => {
        const progress = await getProgress(userId, item.course.id);
        return {
          ...item.course,
          category: item.category,
          chapters: chaptersByCourse.get(item.course.id) || [],
          progress,
        };
      })
    );

    const completedCourses = coursesList.filter(
      (course) => course.progress === 100
    );

    const coursesInProgress = coursesList.filter(
      (course) => course.progress !== null && course.progress !== 100
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES]: ", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
