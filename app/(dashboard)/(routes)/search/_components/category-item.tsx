"use client";

import qs from "query-string";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

interface CategoryItemProps {
  label: string;
  value?: string;
  icon?: LucideIcon;
}

export const CategoryItem = ({
  label,
  value,
  icon: Icon,
}: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-1 rounded-full border-2 border-purple-200/70 bg-white px-3 py-2 text-sm font-medium shadow-sm transition-all hover:border-purple-400/80 hover:shadow-md dark:border-purple-700/50 dark:bg-gray-900/90 dark:hover:border-purple-600/80",
        isSelected &&
          "border-purple-600 bg-purple-100 text-purple-900 shadow-md dark:border-purple-500 dark:bg-purple-950/80 dark:text-purple-100"
      )}
      type="button"
    >
      {Icon && <Icon className="h-5 w-5 shrink-0" />}
      <div className="truncate">{label}</div>
    </button>
  );
};
