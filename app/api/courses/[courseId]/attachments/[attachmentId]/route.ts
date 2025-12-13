import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courses, attachments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { isTeacher } from "@/lib/teacher";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; attachmentId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, attachmentId } = await params;

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

    const [attachment] = await db
      .select()
      .from(attachments)
      .where(
        and(
          eq(attachments.id, attachmentId),
          eq(attachments.courseId, courseId)
        )
      )
      .limit(1);

    if (!attachment) {
      return new NextResponse("Not found", { status: 404 });
    }

    await db.delete(attachments).where(eq(attachments.id, attachmentId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS_DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
