import type { FC } from "react";
import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
};

/**
 * Renders the global footer with the current year and copyright notice.
 *
 * @param {FooterProps} props - Component props.
 * @param {string} [props.className] - Optional className to extend styles.
 * @returns {JSX.Element} Rendered footer element.
 * @example
 * ```tsx
 * <Footer className="mt-10" />
 * ```
 */
export const Footer: FC<FooterProps> = ({ className = "" }: FooterProps) => {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("border-t bg-white/80 py-6 backdrop-blur-sm", className)}>
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 text-center text-sm text-gray-600 dark:text-gray-300 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium text-gray-800 dark:text-gray-100">Edutrack</p>
        <p className="text-gray-600 dark:text-gray-300">
          © {year} Edutrack. Усі права захищені.
        </p>
      </div>
    </footer>
  );
};

