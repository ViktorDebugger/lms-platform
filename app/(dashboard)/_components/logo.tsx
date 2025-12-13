"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="group mx-auto flex flex-col items-center transition-opacity hover:opacity-80"
    >
      <div className="relative mb-3 transition-transform group-hover:scale-105">
        <Image
          height={130}
          width={130}
          alt="Логотип"
          src="/logo.png"
          className="drop-shadow-sm"
          priority
        />
      </div>
      <h1 className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-purple-400 dark:to-violet-400">
        Edutrack
      </h1>
      <p className={cn("text-muted-foreground mt-1 text-xs")}>
        Платформа навчання
      </p>
    </Link>
  );
};
