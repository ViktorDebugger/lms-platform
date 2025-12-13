import { Category, Course, Chapter } from "@/db/schema";

export type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: Chapter[];
  progress: number | null;
};

export type SafeProfile = {
  id: string;
  userId: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  email: string;
  name: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};
