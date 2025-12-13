"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { SearchInput } from "./search-input";
import { SafeProfile } from "@/types";
import { GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarRoutesProps {
  currentProfile?: SafeProfile | null;
}

export const NavbarRoutes: React.FC<NavbarRoutesProps> = ({
  currentProfile,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const isSearchPage = pathname === "/search";

  const isTeacherByRole =
    currentProfile?.role === "ADMIN" || currentProfile?.role === "TEACHER";

  const isTeacherPage = pathname?.startsWith("/teacher");

  const handleModeSwitch = () => {
    if (isTeacherPage) {
      router.push("/");
    } else {
      router.push("/teacher/courses");
    }
  };

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="ml-auto flex items-center gap-x-2">
        {isTeacherByRole && (
          <Button
            onClick={handleModeSwitch}
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-2 border-2 border-purple-200/70 shadow-sm hover:border-purple-300/80 dark:border-purple-700/50 dark:hover:border-purple-600/80"
            )}
          >
            {isTeacherPage ? (
              <>
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Режим студента</span>
              </>
            ) : (
              <>
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Режим викладача</span>
              </>
            )}
          </Button>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};
