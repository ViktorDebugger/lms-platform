import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courses, chapters, muxData } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Mux from "@mux/mux-node";
import { isTeacher } from "@/lib/teacher";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId || !(await isTeacher(userId))) {
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

    const courseChapters = await db
      .select()
      .from(chapters)
      .where(eq(chapters.courseId, courseId));

    for (const chapter of courseChapters) {
      const [chapterMuxData] = await db
        .select()
        .from(muxData)
        .where(eq(muxData.chapterId, chapter.id))
        .limit(1);

      if (chapterMuxData) {
        await mux.video.assets.delete(chapterMuxData.assetId);
      }
    }

    const deletedCourse = await db
      .delete(courses)
      .where(eq(courses.id, courseId));

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;
    const values = await req.json();

    if (!userId || !(await isTeacher(userId))) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [course] = await db
      .update(courses)
      .set({
        ...values,
        updatedAt: new Date(),
      })
      .where(and(eq(courses.id, courseId), eq(courses.userId, userId)))
      .returning();

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
