import { db } from "@/lib/db";
import { courses, chapters } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  if (!course) {
    return redirect("/");
  }

  const courseChapters = await db
    .select()
    .from(chapters)
    .where(and(eq(chapters.courseId, courseId), eq(chapters.isPublished, true)))
    .orderBy(asc(chapters.position));

  if (courseChapters.length === 0) {
    return redirect("/");
  }

  return redirect(`/courses/${course.id}/chapters/${courseChapters[0].id}`);
};

export default CourseIdPage;
