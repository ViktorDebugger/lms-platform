import { LucideIcon } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";

interface InfoCardProps {
  numberOfItems: number;
  variant?: "default" | "success";
  label: string;
  icon: LucideIcon;
  itemName?: {
    singular: string;
    plural: string;
    pluralGenitive: string;
  };
}

export const InfoCard = ({
  variant,
  icon: Icon,
  numberOfItems,
  label,
  itemName = {
    singular: "Курс",
    plural: "Курси",
    pluralGenitive: "Курсів",
  },
}: InfoCardProps) => {
  return (
    <div className="flex items-center gap-x-2 rounded-xl border-2 border-purple-200/70 bg-gradient-to-br from-white via-purple-50/50 to-violet-50/40 p-4 shadow-md backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-purple-200/40 dark:border-purple-700/50 dark:from-gray-900 dark:via-purple-950/40 dark:to-violet-950/30 dark:hover:shadow-purple-900/40">
      <IconBadge variant={variant} icon={Icon} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500">
          {numberOfItems}{" "}
          {numberOfItems === 1
            ? itemName.singular
            : numberOfItems < 5
              ? itemName.plural
              : itemName.pluralGenitive}
        </p>
      </div>
    </div>
  );
};
