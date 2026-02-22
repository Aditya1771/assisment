"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-6">
      <Link
        href="/dashboard"
        className={`font-medium ${
          pathname === "/dashboard"
            ? "text-primary-600"
            : "text-ink-600 hover:text-primary-600"
        }`}
      >
        Dashboard
      </Link>
      <Link
        href="/dashboard/whatsapp"
        className={`font-medium ${
          pathname === "/dashboard/whatsapp"
            ? "text-primary-600"
            : "text-ink-600 hover:text-primary-600"
        }`}
      >
        WhatsApp Inbox
      </Link>
      <Link
        href="/dashboard/sms"
        className={`font-medium ${
          pathname === "/dashboard/sms"
            ? "text-primary-600"
            : "text-ink-600 hover:text-primary-600"
        }`}
      >
        SMS Inbox
      </Link>
    </nav>
  );
}
