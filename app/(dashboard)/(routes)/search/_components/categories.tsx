"use client";

import { Category } from "@/db/schema";
import {
  Code,
  Code2,
  FileCode,
  Coffee,
  Brackets,
  Zap,
  Server,
  LayoutDashboard,
  Layers,
  Smartphone,
  Database,
  BarChart3,
  DatabaseIcon,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

import { CategoryItem } from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<string, LucideIcon> = {
  JavaScript: Code,
  TypeScript: Code2,
  Python: FileCode,
  Java: Coffee,
  "C#": Brackets,
  React: Zap,
  "Node.js": Server,
  Backend: Server,
  Frontend: LayoutDashboard,
  Mobile: Smartphone,
  "Data Science": BarChart3,
  Database: DatabaseIcon,
};

export const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};
