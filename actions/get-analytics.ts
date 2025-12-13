import { db } from "@/lib/db";
import { purchases, courses } from "@/db/schema";
import { eq } from "drizzle-orm";

type PurchaseWithCourse = {
  purchase: typeof purchases.$inferSelect;
  course: typeof courses.$inferSelect;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((item) => {
    const courseTitle = item.course.title;
    const price = item.course.price ? parseFloat(item.course.price) : 0;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += price;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    const purchasesList = await db
      .select({
        purchase: purchases,
        course: courses,
      })
      .from(purchases)
      .innerJoin(courses, eq(purchases.courseId, courses.id))
      .where(eq(courses.userId, userId));

    const groupedEarnings = groupByCourse(purchasesList);
    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({
        name: courseTitle,
        total: total,
      })
    );

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchasesList.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
