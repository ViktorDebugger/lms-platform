import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { courses, chapters, muxData } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
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

    const [existingMuxData] = await db
      .select()
      .from(muxData)
      .where(eq(muxData.chapterId, chapterId))
      .limit(1);

    if (existingMuxData) {
      await mux.video.assets.delete(existingMuxData.assetId);
    }

    const daletedChapter = await db
      .delete(chapters)
      .where(eq(chapters.id, chapterId));

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

    return NextResponse.json(daletedChapter);
  } catch (error) {
    console.log("[CHAPTER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;
    const { isPublished, ...values } = await req.json();

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

    const [existingChapter] = await db
      .select()
      .from(chapters)
      .where(and(eq(chapters.id, chapterId), eq(chapters.courseId, courseId)))
      .limit(1);

    if (!existingChapter) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (values.videoUrl) {
      const [existingMuxData] = await db
        .select()
        .from(muxData)
        .where(eq(muxData.chapterId, chapterId))
        .limit(1);

      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId);
        await db.delete(muxData).where(eq(muxData.id, existingMuxData.id));
      }

      const asset = await mux.video.assets.create({
        inputs: [{ url: values.videoUrl }],
        playback_policy: ["public"],
        test: false,
      });

      let playbackId = asset.playback_ids?.[0]?.id;

      if (!playbackId) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const updatedAsset = await mux.video.assets.retrieve(asset.id);
        playbackId = updatedAsset.playback_ids?.[0]?.id;
      }

      await db.insert(muxData).values({
        chapterId: chapterId,
        assetId: asset.id,
        playbackId: playbackId || null,
      });
    }

    const [chapter] = await db
      .update(chapters)
      .set({
        ...values,
        updatedAt: new Date(),
      })
      .where(eq(chapters.id, chapterId))
      .returning();

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
