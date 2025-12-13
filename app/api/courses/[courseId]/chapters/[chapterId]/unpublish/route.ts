import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courses, chapters } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [course] = await db
      .select()
      .from(courses)
      .where(and(eq(courses.id, courseId), eq(courses.userId, userId)))
      .limit(1);

    if (!course) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [chapter] = await db
      .select()
      .from(chapters)
      .where(and(eq(chapters.id, chapterId), eq(chapters.courseId, courseId)))
      .limit(1);

    if (!chapter) {
      return new NextResponse("Not found", { status: 404 });
    }

    const [updatedChapter] = await db
      .update(chapters)
      .set({
        isPublished: false,
        updatedAt: new Date(),
      })
      .where(eq(chapters.id, chapterId))
      .returning();

    const publishedChaptersInCourse = await db
      .select()
      .from(chapters)
      .where(
        and(eq(chapters.courseId, courseId), eq(chapters.isPublished, true))
      );

    if (!publishedChaptersInCourse.length) {
      await db
        .update(courses)
        .set({ isPublished: false })
        .where(eq(courses.id, courseId));
    }

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
