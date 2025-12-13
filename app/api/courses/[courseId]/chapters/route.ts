import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courses, chapters } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { isTeacher } from "@/lib/teacher";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;
    const { title } = await req.json();

    if (!userId || !(await isTeacher(userId))) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [courseOwner] = await db
      .select()
      .from(courses)
      .where(and(eq(courses.id, courseId), eq(courses.userId, userId)))
      .limit(1);

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastChapter = await db
      .select()
      .from(chapters)
      .where(eq(chapters.courseId, courseId))
      .orderBy(desc(chapters.position))
      .limit(1);

    const newPosition =
      lastChapter.length > 0 && lastChapter[0]
        ? lastChapter[0].position + 1
        : 1;

    const [chapter] = await db
      .insert(chapters)
      .values({
        title: title,
        courseId: courseId,
        position: newPosition,
      })
      .returning();

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
