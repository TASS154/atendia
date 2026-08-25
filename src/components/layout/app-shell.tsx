"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { SimulatorPanel } from "./simulator";

export function AppShell({
  company,
  user,
  notifications,
  children,
}: {
  company: string;
  user: { name: string; role: string; initials: string };
  notifications: {
    id: string;
    title: string;
    body: string;
    href: string | null;
    read: boolean;
    createdAt: string;
  }[];
  children: ReactNode;
}) {
  const [menu, setMenu] = useState(false);
  return (
    <div className="flex min-h-full">
      <Sidebar
        company={company}
        user={user}
        open={menu}
        onClose={() => setMenu(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar notifications={notifications} onMenu={() => setMenu(true)} />
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
      <SimulatorPanel />
    </div>
  );
}
