import { db } from "@/lib/db";
import { courses, categories, attachments, chapters } from "@/db/schema";
import { eq, asc, desc, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { ChaptersList } from "./_components/chapters-list";
import { Banner } from "@/components/banner";
import { CourseActions } from "./_components/course-actions";

const CourseIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { courseId } = await params;

  const [course] = await db
    .select()
    .from(courses)
    .where(and(eq(courses.id, courseId), eq(courses.userId, userId)))
    .limit(1);

  if (!course) {
    redirect("/");
  }

  const courseAttachments = await db
    .select()
    .from(attachments)
    .where(eq(attachments.courseId, courseId))
    .orderBy(desc(attachments.createdAt));

  const courseChapters = await db
    .select()
    .from(chapters)
    .where(eq(chapters.courseId, courseId))
    .orderBy(asc(chapters.position));

  const courseWithData = {
    ...course,
    attachments: courseAttachments,
    chapters: courseChapters,
  };

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    courseChapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `${completedFields}/${totalFields}`;

  const isComplete = requiredFields.every(Boolean);

  let categoriesList: { id: string; name: string }[] = [];
  let categoryOptions: { label: string; value: string }[] = [];
  categoriesList = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.name));

  categoryOptions = categoriesList.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  return (
    <>
      {!course.isPublished && (
        <div className="mx-auto w-full max-w-2xl p-4 md:p-6">
          <Banner
            variant="warning"
            label="Цей курс не опубліковано. Він не буде видимий для студентів."
          />
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-transparent to-violet-50/30 p-6 dark:from-purple-950/10 dark:via-transparent dark:to-violet-950/10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Налаштування курсу</h1>
            <span className="text-sm text-slate-700">
              Заповніть всі поля {completionText}
            </span>
          </div>
          <CourseActions
            disabled={!isComplete}
            courseId={courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Налаштуйте ваш курс</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categoryOptions}
            />
          </div>
          <div className="space-y-8">
            <div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Розділи курсу</h2>
                </div>
              </div>
              <ChaptersForm initialData={courseWithData} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Ціна</h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Ресурси та додатки</h2>
              </div>
              <AttachmentForm
                initialData={courseWithData}
                courseId={course.id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
