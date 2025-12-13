"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 pl-6 text-sm text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600",
        isActive &&
          `bg-gray-200/20 text-gray-900 hover:bg-gray-200/20 hover:text-gray-900 dark:bg-purple-200/20 dark:text-slate-200 dark:hover:bg-purple-200/20 dark:hover:text-purple-700`
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-500",
            isActive && `text-gray-900 dark:text-purple-300`
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto border-2 opacity-0",
          isActive &&
            `h-full border-gray-900 bg-gray-200/20 opacity-100 transition-all dark:border-purple-700 dark:bg-purple-200/20 dark:text-white`
        )}
      />
    </button>
  );
};

export default SidebarItem;
