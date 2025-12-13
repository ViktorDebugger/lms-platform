import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courses, chapters } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

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

    const publishedChapters = await db
      .select()
      .from(chapters)
      .where(
        and(eq(chapters.courseId, courseId), eq(chapters.isPublished, true))
      );

    if (!publishedChapters.length) {
      return new NextResponse(
        "Course must have at least one published chapter",
        { status: 400 }
      );
    }

    const [updatedCourse] = await db
      .update(courses)
      .set({
        isPublished: true,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, courseId))
      .returning();

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.log("[COURSE_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
