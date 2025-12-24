import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { courses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Мої курси | Edutrack",
  description: "Керуйте своїми курсами",
};

export const dynamic = "force-dynamic";

const CoursesPage = async () => {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    return redirect("/");
  }

  const coursesList = await db
    .select()
    .from(courses)
    .where(eq(courses.userId, userId))
    .orderBy(desc(courses.createdAt));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-transparent to-violet-50/30 p-6 dark:from-purple-950/10 dark:via-transparent dark:to-violet-950/10">
      <DataTable columns={columns} data={coursesList} />
    </div>
  );
};

export default CoursesPage;
