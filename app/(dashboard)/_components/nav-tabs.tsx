"use client";

import { Layout, Compass, List, BarChart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SafeProfile } from "@/types";

const STUDENTRoutes = [
  {
    icon: Layout,
    label: "Панель",
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

interface NavTabsProps {
  currentProfile?: SafeProfile | null;
}

export const NavTabs = ({ currentProfile }: NavTabsProps) => {
  const pathname = usePathname();

  const isTeacherByRole =
    currentProfile?.role === "ADMIN" || currentProfile?.role === "TEACHER";

  const isTeacherPage = pathname?.startsWith("/teacher");

  const isTeacher = isTeacherByRole || isTeacherPage;

  const routes = isTeacher ? teacherRoutes : STUDENTRoutes;

  return (
    <div className="hidden items-center gap-1 rounded-lg border border-purple-200/50 bg-white/50 p-1 backdrop-blur-sm md:flex dark:border-purple-800/50 dark:bg-gray-900/50">
      {routes.map((route) => {
        const Icon = route.icon;
        const isActive =
          (pathname === "/" && route.href === "/") ||
          pathname === route.href ||
          pathname?.startsWith(`${route.href}/`);

        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
              isActive
                ? "bg-purple-600 text-white shadow-md shadow-purple-200/50 dark:bg-purple-700 dark:shadow-purple-900/50"
                : "text-gray-700 hover:bg-purple-50/50 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-purple-950/50 dark:hover:text-purple-300"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{route.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
