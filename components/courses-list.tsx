import { CourseCard } from "@/components/course-card";
import { BookOpen, SearchX } from "lucide-react";

import { CourseWithProgressWithCategory } from "@/types";

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
}

export const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {items.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            chaptersLength={item.chapters.length}
            price={item.price ? parseFloat(item.price) : 0}
            progress={item.progress}
            category={item?.category?.name!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="rounded-full bg-purple-100 p-4 dark:bg-purple-950/50">
            <SearchX className="h-8 w-8 text-purple-700 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Курсів не знайдено
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Спробуйте змінити фільтри або пошуковий запит
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
