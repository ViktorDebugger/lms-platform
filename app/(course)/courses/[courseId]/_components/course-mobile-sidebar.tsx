"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Chapter, Course, UserProgress } from "@/db/schema";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { CourseSidebarContent } from "./course-sidebar-content";
import { usePathname } from "next/navigation";

interface CourseMobileSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
  hasPurchase: boolean;
}

export const CourseMobileSidebar = ({
  course,
  progressCount,
  hasPurchase,
}: CourseMobileSidebarProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          aria-label="Відкрити меню курсу"
          title="Відкрити меню курсу"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetTitle className="sr-only">Меню курсу</SheetTitle>
        <CourseSidebarContent
          course={course}
          progressCount={progressCount}
          hasPurchase={hasPurchase}
        />
      </SheetContent>
    </Sheet>
  );
};
