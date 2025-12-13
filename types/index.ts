export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

export type SafeProfile = {
  id: string;
  userId: string;
  role: UserRole;
  email: string;
  name: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

import { Course, Category, Chapter } from "@/db/schema";

export type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};
