"use client";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className="flex">
      {!isLoginPage && <Sidebar />}
      <main className={`flex-1 min-h-screen p-8 ${!isLoginPage ? 'ml-64' : ''}`}>
        {children}
      </main>
    </div>
  );
}
