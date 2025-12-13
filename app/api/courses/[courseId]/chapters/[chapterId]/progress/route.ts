import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { userProgress } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ courseId: string; chapterId: string }>;
  }
) {
  try {
    const { userId } = await auth();
    const { isCompleted } = await req.json();
    const { chapterId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [existing] = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.chapterId, chapterId)
        )
      )
      .limit(1);

    let result;
    if (existing) {
      [result] = await db
        .update(userProgress)
        .set({
          isCompleted,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(userProgress.userId, userId),
            eq(userProgress.chapterId, chapterId)
          )
        )
        .returning();
    } else {
      [result] = await db
        .insert(userProgress)
        .values({
          userId,
          chapterId,
          isCompleted,
        })
        .returning();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
