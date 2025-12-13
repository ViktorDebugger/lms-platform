import { AlertTriangle, CheckCircleIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const bannerVariants = cva(
  "rounded-xl border-2 text-center p-4 text-sm font-medium flex items-center w-full shadow-md backdrop-blur-sm",
  {
    variants: {
      variant: {
        warning:
          "bg-gradient-to-r from-yellow-50/90 via-yellow-100/80 to-yellow-50/90 border-yellow-400/70 text-yellow-900 shadow-yellow-200/40 dark:from-yellow-900/60 dark:via-yellow-950/50 dark:to-yellow-900/60 dark:border-yellow-600/60 dark:text-yellow-100 dark:shadow-yellow-900/50",
        success:
          "bg-gradient-to-r from-emerald-50/90 via-emerald-100/80 to-emerald-50/90 border-emerald-500/70 text-emerald-900 shadow-emerald-200/40 dark:from-emerald-900/60 dark:via-emerald-950/50 dark:to-emerald-900/60 dark:border-emerald-600/60 dark:text-emerald-100 dark:shadow-emerald-900/50",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
}

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};

export const Banner = ({ label, variant }: BannerProps) => {
  const Icon = iconMap[variant || "warning"];

  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="mr-3 h-5 w-5 shrink-0" />
      <span className="text-left">{label}</span>
    </div>
  );
};
