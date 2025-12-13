"use client";

import {
  Layout,
  Compass,
  List,
  BarChart,
  GraduationCap,
  Users,
} from "lucide-react";
import SidebarItem from "./sidebar-item";
import { usePathname, useRouter } from "next/navigation";
import { SafeProfile } from "@/types";
import { cn } from "@/lib/utils";

const studentRoutes = [
  {
    icon: Layout,
    label: "Панель керування",
    href: "/",
  },
  {
    icon: Compass,
    label: "Перегляд",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Курси",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Аналітика",
    href: "/teacher/analytics",
  },
];

interface SidebarRoutesProps {
  currentProfile?: SafeProfile | null;
}

export const SidebarRoutes = ({ currentProfile }: SidebarRoutesProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherByRole =
    currentProfile?.role === "ADMIN" || currentProfile?.role === "TEACHER";

  const isTeacherPage = pathname?.startsWith("/teacher");

  const routes = isTeacherPage ? teacherRoutes : studentRoutes;

  const handleModeSwitch = () => {
    if (isTeacherPage) {
      router.push("/");
    } else {
      router.push("/teacher/courses");
    }
  };

  return (
    <div className="flex w-full flex-col">
      {routes.map((route, index) => (
        <SidebarItem
          key={index}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
      {isTeacherByRole && (
        <button
          onClick={handleModeSwitch}
          type="button"
          className={cn(
            "mx-4 mt-4 flex items-center justify-center gap-x-2 rounded-lg border-2 border-purple-200/70 bg-gradient-to-r from-purple-50/80 to-violet-50/80 px-4 py-2.5 text-sm font-medium text-purple-700 transition-all hover:border-purple-300/80 hover:bg-purple-100/60 hover:shadow-md dark:border-purple-700/50 dark:from-purple-950/40 dark:to-violet-950/40 dark:text-purple-300 dark:hover:border-purple-600/60 dark:hover:bg-purple-900/40"
          )}
        >
          {isTeacherPage ? (
            <>
              <Users className="h-4 w-4" />
              <span>Режим студента</span>
            </>
          ) : (
            <>
              <GraduationCap className="h-4 w-4" />
              <span>Режим викладача</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
