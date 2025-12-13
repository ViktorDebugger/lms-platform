"use client";

import {
  Layout,
  Compass,
  List,
  BarChart,
  Menu,
  GraduationCap,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { SafeProfile } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const STUDENTRoutes = [
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

interface NavDropdownProps {
  currentProfile?: SafeProfile | null;
}

export const NavDropdown = ({ currentProfile }: NavDropdownProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherByRole =
    currentProfile?.role === "ADMIN" || currentProfile?.role === "TEACHER";

  const isTeacherPage = pathname?.startsWith("/teacher");

  const routes = isTeacherPage ? teacherRoutes : STUDENTRoutes;

  const handleSelect = (href: string) => {
    router.push(href);
  };

  const handleModeSwitch = () => {
    if (isTeacherPage) {
      router.push("/");
    } else {
      router.push("/teacher/courses");
    }
  };

  const currentRoute = routes.find(
    (route) =>
      (pathname === "/" && route.href === "/") ||
      pathname === route.href ||
      pathname?.startsWith(`${route.href}/`)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-2 border-purple-200/70 shadow-sm hover:border-purple-300/80 dark:border-purple-700/50 dark:hover:border-purple-600/80"
        >
          <Menu className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentRoute?.label || "Меню"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-w-[300px] min-w-[200px] border-2 border-purple-200/70 bg-white shadow-lg dark:border-purple-700/50 dark:bg-gray-900"
      >
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive =
            (pathname === "/" && route.href === "/") ||
            pathname === route.href ||
            pathname?.startsWith(`${route.href}/`);

          return (
            <DropdownMenuItem
              key={route.href}
              onSelect={() => handleSelect(route.href)}
              className={cn(
                "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-100"
                  : "text-gray-700 hover:bg-purple-50/50 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-purple-950/50 dark:hover:text-purple-300"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="min-w-0 truncate">{route.label}</span>
            </DropdownMenuItem>
          );
        })}
        {isTeacherByRole && (
          <>
            <DropdownMenuSeparator className="my-1 bg-purple-200/50 dark:bg-purple-800/50" />
            <DropdownMenuItem
              onSelect={handleModeSwitch}
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-50/50 dark:text-purple-300 dark:hover:bg-purple-950/50"
            >
              {isTeacherPage ? (
                <>
                  <Users className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 truncate">Режим студента</span>
                </>
              ) : (
                <>
                  <GraduationCap className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 truncate">Режим викладача</span>
                </>
              )}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
