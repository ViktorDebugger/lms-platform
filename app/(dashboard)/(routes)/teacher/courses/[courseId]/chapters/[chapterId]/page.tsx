import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { courses, chapters, muxData } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/chapter-actions";

const ChapterIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { courseId, chapterId } = await params;

  const [course] = await db
    .select()
    .from(courses)
    .where(and(eq(courses.id, courseId), eq(courses.userId, userId)))
    .limit(1);

  if (!course) {
    redirect("/");
  }

  const [chapter] = await db
    .select()
    .from(chapters)
    .where(and(eq(chapters.id, chapterId), eq(chapters.courseId, courseId)))
    .limit(1);

  if (!chapter) {
    redirect("/");
  }

  const [chapterMuxData] = await db
    .select()
    .from(muxData)
    .where(eq(muxData.chapterId, chapterId))
    .limit(1);

  const chapterWithData = {
    ...chapter,
    muxData: chapterMuxData || null,
  };

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `${completedFields}/${totalFields}`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <div className="mx-auto w-full max-w-2xl p-4 md:p-6">
          <Banner
            variant="warning"
            label="Цей розділ не опубліковано. Він не буде видимий в курсі."
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${courseId}`}
              className="mb-6 flex items-center text-sm transition hover:opacity-75"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад до налаштування курсу
            </Link>

            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Створення розділу</h1>
                <span className="text-sm text-slate-700">
                  Заповніть всі поля {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={courseId}
                chapterId={chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Налаштуйте ваш розділ</h2>
              </div>
              <ChapterTitleForm
                initialData={chapter}
                courseId={course.id}
                chapterId={chapter.id}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={course.id}
                chapterId={chapter.id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>
              <ChapterAccessForm
                initialData={chapter}
                courseId={course.id}
                chapterId={chapter.id}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Додати відео</h2>
            </div>
            <ChapterVideoForm
              initialData={chapter}
              courseId={course.id}
              chapterId={chapter.id}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterIdPage;
