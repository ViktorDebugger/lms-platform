import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getAnalytics } from "@/actions/get-analytics";
import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";

export const metadata: Metadata = {
  title: "Аналітика | Edutrack",
  description: "Перегляньте статистику ваших курсів",
};

const AnalyticsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);

  return (
    <div className="p-6">
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <DataCard label="Загальний дохід" value={totalRevenue} shouldFormat />
        <DataCard
          label="Загальні продажі"
          value={totalSales}
          shouldFormat={false}
        />
      </div>
      <Chart data={data} />
    </div>
  );
};

export default AnalyticsPage;
