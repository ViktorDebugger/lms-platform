import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const TeacherLayout = async ({ children }: { children: ReactNode }) => {
  const { userId } = await auth();

  if (!(await isTeacher(userId || undefined))) {
    return redirect("/");
  }

  return <>{children}</>;
};

export default TeacherLayout;
