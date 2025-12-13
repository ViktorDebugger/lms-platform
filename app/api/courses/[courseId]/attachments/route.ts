import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courses, attachments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { isTeacher } from "@/lib/teacher";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;
    const { url } = await req.json();

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
      .insert(attachments)
      .values({
        url: url,
        name: url.split("/").pop() || "attachment",
        courseId: courseId,
      })
      .returning();

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
