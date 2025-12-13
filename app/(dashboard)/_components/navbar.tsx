"use client";

import Image from "next/image";
import Link from "next/link";
import { NavbarRoutes } from "@/components/navbar-routes";
import { SafeProfile } from "@/types";
import { NavDropdown } from "./nav-dropdown";

interface NavbarProps {
  currentProfile?: SafeProfile | null;
}

export const Navbar = ({ currentProfile }: NavbarProps) => {
  return (
    <div className="flex h-full items-center justify-between border-b-2 border-purple-200/70 bg-white/80 p-4 text-gray-900 shadow-sm backdrop-blur-md dark:border-purple-700/50 dark:bg-gray-900/80 dark:text-white">
      <div className="flex min-w-0 items-center gap-4">
        <NavDropdown currentProfile={currentProfile} />
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Image
            height={32}
            width={32}
            alt="Логотип"
            src="/logo.png"
            className="h-8 w-8 shrink-0"
            priority
          />
          <span className="truncate bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-purple-400 dark:to-violet-400">
            Edutrack
          </span>
        </Link>
      </div>
      <NavbarRoutes currentProfile={currentProfile} />
    </div>
  );
};
