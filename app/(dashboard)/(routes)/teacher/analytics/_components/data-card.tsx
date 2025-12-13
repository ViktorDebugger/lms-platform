import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { DollarSign, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataCardProps {
  value: number;
  label: string;
  shouldFormat?: boolean;
}

export const DataCard = ({
  value,
  label,
  shouldFormat = true,
}: DataCardProps) => {
  const isRevenue = label === "Загальний дохід";
  const Icon = isRevenue ? DollarSign : ShoppingCart;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-xl",
        isRevenue
          ? "bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-teal-50 border-emerald-200/70 dark:from-emerald-950/30 dark:via-emerald-900/20 dark:to-teal-950/30 dark:border-emerald-800/50"
          : "bg-gradient-to-br from-purple-50 via-purple-100/50 to-violet-50 border-purple-200/70 dark:from-purple-950/30 dark:via-purple-900/20 dark:to-violet-950/30 dark:border-purple-800/50"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle
          className={cn(
            "text-base font-semibold",
            isRevenue
              ? "text-emerald-900 dark:text-emerald-100"
              : "text-purple-900 dark:text-purple-100"
          )}
        >
          {label}
        </CardTitle>
        <div
          className={cn(
            "rounded-full p-2",
            isRevenue
              ? "bg-emerald-200/80 dark:bg-emerald-900/50"
              : "bg-purple-200/80 dark:bg-purple-900/50"
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5",
              isRevenue
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-purple-700 dark:text-purple-300"
            )}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "text-3xl font-bold tracking-tight",
            isRevenue
              ? "text-emerald-900 dark:text-emerald-100"
              : "text-purple-900 dark:text-purple-100"
          )}
        >
          {shouldFormat ? formatPrice(value) : value}
        </div>
        <p
          className={cn(
            "mt-2 text-xs font-medium",
            isRevenue
              ? "text-emerald-700/80 dark:text-emerald-300/80"
              : "text-purple-700/80 dark:text-purple-300/80"
          )}
        >
          {isRevenue
            ? "Загальний дохід від продажів"
            : "Кількість проданих курсів"}
        </p>
      </CardContent>
    </Card>
  );
};
