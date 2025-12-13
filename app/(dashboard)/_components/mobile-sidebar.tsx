"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar";
import { SafeProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

interface MobileSidebarProps {
  currentProfile?: SafeProfile | null;
}

export const MobileSidebar = ({ currentProfile }: MobileSidebarProps) => {
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
          aria-label="Відкрити меню"
          title="Відкрити меню"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-56 p-0">
        <SheetTitle className="sr-only">Меню навігації</SheetTitle>
        <Sidebar currentProfile={currentProfile} />
      </SheetContent>
    </Sheet>
  );
};
