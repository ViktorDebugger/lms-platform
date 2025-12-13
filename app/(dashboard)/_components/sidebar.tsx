"use client";

import { SidebarRoutes } from "./sidebar-routes";
import { SafeProfile } from "@/types";

interface SidebarProps {
  currentProfile?: SafeProfile | null;
}

export const Sidebar = ({ currentProfile }: SidebarProps) => {
  return (
    <div
      className={`flex h-full flex-col overflow-y-auto border-r bg-gradient-to-b from-purple-50/50 via-white to-violet-50/50 text-gray-900 shadow-sm backdrop-blur-sm dark:from-gray-950 dark:via-purple-950/20 dark:to-violet-950/30 dark:text-white`}
    >
      <div className="flex w-full flex-col">
        <SidebarRoutes currentProfile={currentProfile} />
      </div>
    </div>
  );
};
