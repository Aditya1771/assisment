"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ATLAS_NETWORK_LINK = "https://cloud.mongodb.com/v2#/security/network/access";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "";
  const isIpWhitelistError =
    error.toLowerCase().includes("whitelist") ||
    error.toLowerCase().includes("could not connect to any servers");

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-ink-200 p-8">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Unified Inbox
          </Link>
          <h1 className="mt-4 text-xl font-bold text-ink-900">Sign-in error</h1>
        </div>

        {isIpWhitelistError ? (
          <div className="space-y-4">
            <p className="text-ink-700 text-sm">
              MongoDB Atlas is blocking the connection. Follow the steps below.
              If you already added 0.0.0.0/0 and it still fails, use the
              <strong> “Still not working?”</strong> checklist.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-ink-700">
              <li>
                Open{" "}
                <a
                  href={ATLAS_NETWORK_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 underline"
                >
                  MongoDB Atlas → Network Access
                </a>{" "}
                (log in if needed).
              </li>
              <li>
                Click <strong>Add IP Address</strong> (or Add Entry).
              </li>
              <li>
                Click <strong>Allow Access from Anywhere</strong> — this adds{" "}
                <code className="bg-ink-100 px-1 rounded">0.0.0.0/0</code>.
                <br />
                <span className="text-ink-500">
                  (For production, add only your IP instead.)
                </span>
              </li>
              <li>Click Confirm and wait 1–2 minutes.</li>
              <li>Try signing in again below.</li>
            </ol>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
              <p className="font-semibold text-amber-900 mb-2">
                Still not working? Check this:
              </p>
              <ul className="list-disc list-inside space-y-1 text-amber-800">
                <li>
                  <strong>Right project:</strong> Your <code className="bg-white/60 px-1 rounded">MONGODB_URI</code> in
                  .env.local points to one cluster (e.g. <code className="bg-white/60 px-1 rounded">codingbaba1771.hrt5lwo.mongodb.net</code>).
                  That cluster belongs to <em>one</em> Atlas project. In the Atlas
                  top bar, open the <strong>Project</strong> dropdown and switch
                  until you see the project that contains that cluster. Add
                  0.0.0.0/0 in <em>that</em> project’s <strong>Network Access</strong>.
                </li>
                <li>
                  In <strong>Network Access</strong>, confirm an entry for{" "}
                  <code className="bg-white/60 px-1 rounded">0.0.0.0/0</code> exists and status is
                  <strong> Active</strong> (not Pending).
                </li>
                <li>
                  Restart the dev server (stop <code className="bg-white/60 px-1 rounded">npm run dev</code>, then run it
                  again) and wait 2–3 minutes after adding the IP.
                </li>
                <li>
                  If you have multiple Atlas projects, add 0.0.0.0/0 in
                  <strong> each</strong> project that has a cluster you might be
                  using.
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-ink-700 text-sm">{error || "An error occurred."}</p>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/auth/signin"
            className="w-full py-3 px-4 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 text-center transition"
          >
            Try again
          </Link>
          <Link
            href="/"
            className="w-full text-center text-ink-600 text-sm hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-ink-50">
          <div className="text-ink-600">Loading…</div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
