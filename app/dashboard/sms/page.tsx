"use client";

import InboxPanel from "@/components/InboxPanel";

export default function SMSInboxPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-2">SMS Inbox</h1>
      <p className="text-ink-600 mb-8">
        Enter context for your marketing message. We&apos;ll generate copy with AI, then you can edit and send via SMS (Twilio).
      </p>
      <InboxPanel channel="sms" />
    </div>
  );
}
