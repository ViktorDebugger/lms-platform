import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { File, BookOpen, Tag } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Preview } from "@/components/preview";

import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";

interface ChapterIdPageProps {
  params: Promise<{ courseId: string; chapterId: string }>;
}

export async function generateMetadata({
  params,
}: ChapterIdPageProps): Promise<Metadata> {
  const { courseId, chapterId } = await params;

  try {
    const { db } = await import("@/lib/db");
    const { courses, chapters } = await import("@/db/schema");
    const { eq, and } = await import("drizzle-orm");

    const [course] = await db
      .select({ title: courses.title })
      .from(courses)
      .where(and(eq(courses.id, courseId), eq(courses.isPublished, true)))
      .limit(1);

    const [chapter] = await db
      .select({ title: chapters.title, description: chapters.description })
      .from(chapters)
      .where(and(eq(chapters.id, chapterId), eq(chapters.isPublished, true)))
      .limit(1);

    if (chapter && course) {
      return {
        title: `${chapter.title} | ${course.title} | Edutrack`,
        description: chapter.description || "Перегляньте розділ курсу",
      };
    }
  } catch {
    // Fall through to default metadata
  }

  return {
    title: "Розділ курсу | Edutrack",
    description: "Перегляньте розділ курсу",
  };
}

const ChapterIdPage = async ({ params }: ChapterIdPageProps) => {
  const { userId } = await auth();
  const { courseId, chapterId } = await params;

  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId,
    courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  const coursePrice = course.price ? parseFloat(course.price) : 0;

  return (
    <div className="w-full min-w-0">
      {(userProgress?.isCompleted || isLocked) && (
        <div className="mx-auto w-full max-w-2xl p-4 md:p-6">
          {userProgress?.isCompleted && (
            <Banner variant="success" label="Ви вже завершили цей розділ." />
          )}
          {isLocked && (
            <Banner
              variant="warning"
              label="Вам потрібно придбати цей курс, щоб переглянути цей розділ."
            />
          )}
        </div>
      )}
      <div className="flex w-full min-w-0 flex-col pb-20">
        <div className="w-full min-w-0 p-4 md:p-6">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div className="w-full min-w-0 px-4 md:px-6">
          <div className="relative flex w-full min-w-0 flex-col rounded-xl border-2 border-purple-200/70 bg-white/90 p-6 shadow-md backdrop-blur-md md:px-8 dark:border-purple-700/50 dark:bg-gray-900/90">
            <h2 className="min-w-0 truncate bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-xl font-bold text-transparent sm:text-2xl dark:from-gray-100 dark:to-gray-300">
              {chapter.title}
            </h2>
            <div className="mt-4 flex justify-end">
              {purchase ? (
                <CourseProgressButton
                  chapterId={chapterId}
                  courseId={courseId}
                  nextChapterId={nextChapter?.id}
                  isCompleted={!!userProgress?.isCompleted}
                />
              ) : (
                <CourseEnrollButton courseId={courseId} price={coursePrice} />
              )}
            </div>
          </div>
          {(course.description ||
            course.categoryName ||
            attachments.length > 0) && (
            <div className="mt-6 rounded-xl border-2 border-purple-200/70 bg-white/90 p-6 shadow-md backdrop-blur-md md:p-8 dark:border-purple-700/50 dark:bg-gray-900/90">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold">Про курс</h3>
              </div>
              {course.categoryName && (
                <div className="mb-4 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                    {course.categoryName}
                  </span>
                </div>
              )}
              {course.description && (
                <div className="mt-4">
                  <Preview value={course.description} />
                </div>
              )}
              {attachments.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                    <File className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    Файли курсу
                  </h4>
                  <div className="flex flex-col gap-3">
                    {attachments.map((attachment, index) => (
                      <a
                        href={attachment.url}
                        target="_blank"
                        key={attachment.id}
                        className="group flex w-full items-center gap-3 rounded-lg border-2 border-purple-200/70 bg-gradient-to-r from-purple-50/80 to-violet-50/80 p-4 text-purple-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-purple-300/80 hover:shadow-lg hover:shadow-purple-200/40 dark:border-purple-700/50 dark:from-purple-950/60 dark:to-violet-950/60 dark:text-purple-300 dark:hover:border-purple-600/60 dark:hover:shadow-purple-900/50"
                      >
                        <File className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                        <p className="line-clamp-1 font-medium">
                          Файл {index + 1}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="mt-6 rounded-xl border-2 border-purple-200/70 bg-white/90 p-6 shadow-md backdrop-blur-md md:p-8 dark:border-purple-700/50 dark:bg-gray-900/90">
            <h3 className="mb-4 text-xl font-bold">Опис розділу</h3>
            <Preview value={chapter.description!} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
