import { ReactNode } from "react";
import { Navbar } from "./_components/navbar";
import { getProfile } from "@/lib/get-profile";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const currentProfile = await getProfile();

  return (
    <div className="h-full bg-gradient-to-br from-purple-100/60 via-purple-50/40 to-violet-100/60 dark:from-gray-950 dark:via-purple-950/30 dark:to-violet-950/40">
      <div className="fixed top-0 right-0 left-0 z-50 h-[80px] w-full border-b border-purple-100/50 bg-white/80 backdrop-blur-md dark:border-purple-900/30 dark:bg-gray-900/80">
        <Navbar currentProfile={currentProfile} />
      </div>
      <main className="h-full min-h-screen pt-[80px]">{children}</main>
    </div>
  );
};

export default DashboardLayout;
