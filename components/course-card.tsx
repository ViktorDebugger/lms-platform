import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "@/components/course-progress";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group h-full overflow-hidden rounded-xl border-2 border-purple-200/70 bg-gradient-to-br from-white via-purple-50/40 to-violet-50/30 p-4 shadow-md backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-purple-300/80 hover:shadow-xl hover:shadow-purple-300/40 dark:border-purple-700/50 dark:from-gray-900 dark:via-purple-950/30 dark:to-violet-950/30 dark:hover:border-purple-600/60 dark:hover:shadow-purple-900/50">
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image fill className="object-cover" alt={title} src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="line-clamp-2 text-lg font-medium transition group-hover:text-purple-700 md:text-base dark:group-hover:text-purple-500">
            {title}
          </div>
          <p className="text-muted-foreground text-xs">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength}{" "}
                {chaptersLength === 1
                  ? "Розділ"
                  : chaptersLength < 5
                    ? "Розділи"
                    : "Розділів"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
          ) : (
            <p className="text-md font-medium text-slate-700 md:text-sm">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
