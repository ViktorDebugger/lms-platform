import { LucideIcon } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";

interface BannerCardProps {
  variant?: "default" | "success";
  label: string;
  description: string;
  icon: LucideIcon;
}

export const BannerCard = ({
  variant,
  icon: Icon,
  description,
  label,
}: BannerCardProps) => {
  return (
    <div className="flex items-center gap-x-3 rounded-xl border-2 border-purple-200/70 bg-gradient-to-r from-purple-50/80 via-white to-violet-50/80 p-5 shadow-md backdrop-blur-sm dark:border-purple-700/50 dark:from-purple-950/50 dark:via-gray-900 dark:to-violet-950/50">
      <IconBadge variant={variant} icon={Icon} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-700 dark:text-gray-200">
          {description}
        </p>
      </div>
    </div>
  );
};
