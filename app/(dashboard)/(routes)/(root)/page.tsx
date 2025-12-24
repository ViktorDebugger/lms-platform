import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  CheckCircle,
  Clock,
  InfoIcon,
  BookOpen,
  TrendingUp,
  Award,
  Target,
} from "lucide-react";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { Badge } from "@/components/ui/badge";

import { InfoCard } from "./_components/info-card";
import { BannerCard } from "./_components/banner-card";

export const metadata: Metadata = {
  title: "Панель керування | Edutrack",
  description: "Перегляньте ваш прогрес та продовжуйте навчання",
};

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } =
    await getDashboardCourses(userId);

  const totalCourses = completedCourses.length + coursesInProgress.length;
  const completedChapters = completedCourses.reduce(
    (acc, course) => acc + (course.chapters?.length || 0),
    0
  );

  return (
    <div className="min-h-screen space-y-6 bg-gradient-to-br from-purple-50/30 via-transparent to-violet-50/30 p-6 dark:from-purple-950/10 dark:via-transparent dark:to-violet-950/10">
      <div className="grid grid-cols-1 gap-4">
        <BannerCard
          icon={InfoIcon}
          label="Ласкаво просимо до панелі керування"
          description={`Тут ви можете переглянути свій прогрес 
            та продовжити навчання на курсах. Це демонстраційна LMS платформа, тому всі курси безкоштовні, а Stripe працює в тестовому
             режимі. Для запису на курс введіть тестові дані в форму Stripe.`}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          icon={Clock}
          label="В процесі"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Завершено"
          numberOfItems={completedCourses.length}
          variant="success"
        />
        <InfoCard
          icon={BookOpen}
          label="Всього курсів"
          numberOfItems={totalCourses}
        />
        <InfoCard
          icon={Target}
          label="Розділів пройдено"
          numberOfItems={completedChapters}
          itemName={{
            singular: "Розділ",
            plural: "Розділи",
            pluralGenitive: "Розділів",
          }}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-x-3 rounded-xl border-2 border-purple-200/70 bg-gradient-to-br from-white via-purple-50/40 to-violet-50/30 p-5 shadow-md backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-purple-200/40 dark:border-purple-700/50 dark:from-gray-900 dark:via-purple-950/30 dark:to-violet-950/30 dark:hover:shadow-purple-900/40">
          <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-950/50">
            <TrendingUp className="h-6 w-6 text-purple-700 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Прогрес навчання</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {totalCourses > 0
                ? `${Math.round(
                    (completedCourses.length / totalCourses) * 100
                  )}% курсів завершено`
                : "Почніть свій перший курс"}
            </p>
          </div>
          <Badge variant="default" className="shrink-0">
            {totalCourses > 0
              ? `${Math.round((completedCourses.length / totalCourses) * 100)}%`
              : "0%"}
          </Badge>
        </div>
        <div className="flex items-center gap-x-3 rounded-xl border-2 border-purple-200/70 bg-gradient-to-br from-white via-purple-50/40 to-violet-50/30 p-5 shadow-md backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-purple-200/40 dark:border-purple-700/50 dark:from-gray-900 dark:via-purple-950/30 dark:to-violet-950/30 dark:hover:shadow-purple-900/40">
          <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-950/50">
            <Award className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Досягнення</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {completedCourses.length > 0
                ? `${completedCourses.length} ${
                    completedCourses.length === 1 ? "курс" : "курсів"
                  } завершено`
                : "Завершіть перший курс"}
            </p>
          </div>
          <Badge variant="default" className="shrink-0 bg-emerald-600">
            {completedCourses.length}
          </Badge>
        </div>
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}
