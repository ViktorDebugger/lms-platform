import Image from "next/image";
import Link from "next/link";
import { Chapter, Course, UserProgress } from "@/db/schema";

import { NavbarRoutes } from "@/components/navbar-routes";

import { CourseMobileSidebar } from "./course-mobile-sidebar";
import { SafeProfile } from "@/types";

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
  currentProfile?: SafeProfile | null;
  hasPurchase: boolean;
}

export const CourseNavbar = ({
  course,
  progressCount,
  currentProfile,
  hasPurchase,
}: CourseNavbarProps) => {
  return (
    <div className="flex h-full items-center border-b border-purple-100/50 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-purple-900/30 dark:bg-gray-900/80">
      <CourseMobileSidebar
        course={course}
        progressCount={progressCount}
        hasPurchase={hasPurchase}
      />
      <Link
        href="/"
        className="ml-4 flex min-w-0 items-center gap-2 transition-opacity hover:opacity-80 md:ml-6"
      >
        <Image
          height={32}
          width={32}
          alt="Логотип"
          src="/logo.png"
          className="h-8 w-8 shrink-0"
          priority
        />
        <span className="truncate bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-purple-400 dark:to-violet-400">
          Edutrack
        </span>
      </Link>
      <NavbarRoutes currentProfile={currentProfile} />
    </div>
  );
};
