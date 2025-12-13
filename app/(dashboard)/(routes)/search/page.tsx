import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";

import { Categories } from "./_components/categories";

interface SearchPageProps {
  searchParams: Promise<{
    title?: string;
    categoryId?: string;
  }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const params = await searchParams;

  const categoriesList = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.name));

  const courses = await getCourses({
    userId,
    ...params,
  });

  return (
    <>
      <div className="block px-6 pt-6 md:mb-0 md:hidden">
        <SearchInput />
      </div>
      <div className="min-h-screen space-y-4 bg-gradient-to-br from-purple-50/30 via-transparent to-violet-50/30 p-6 dark:from-purple-950/10 dark:via-transparent dark:to-violet-950/10">
        <Categories items={categoriesList} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
