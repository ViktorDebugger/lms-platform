"use client";

import { Course, Chapter, UserProgress } from "@/db/schema";
import { CourseProgress } from "@/components/course-progress";

import { CourseSidebarItem } from "./course-sidebar-item";

interface CourseSidebarContentProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
  hasPurchase: boolean;
}

export const CourseSidebarContent = ({
  course,
  progressCount,
  hasPurchase,
}: CourseSidebarContentProps) => {
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r shadow-sm">
      <div className="flex flex-col border-b p-8">
        <h1 className="font-semibold text-left">{course.title}</h1>
        {hasPurchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex w-full flex-col">
        {course.chapters.map(
          (chapter: Chapter & { userProgress: UserProgress[] | null }) => (
            <CourseSidebarItem
              key={chapter.id}
              id={chapter.id}
              label={chapter.title}
              isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
              courseId={course.id}
              isLocked={!chapter.isFree && !hasPurchase}
            />
          )
        )}
      </div>
    </div>
  );
};
