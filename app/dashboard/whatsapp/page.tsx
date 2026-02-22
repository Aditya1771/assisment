"use client";

import { useState } from "react";
import InboxPanel from "@/components/InboxPanel";

export default function WhatsAppInboxPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-2">WhatsApp Inbox</h1>
      <p className="text-ink-600 mb-8">
        Enter context for your marketing message. We&apos;ll generate copy with AI, then you can edit and send via WhatsApp (Twilio sandbox).
      </p>
      <InboxPanel channel="whatsapp" />
    </div>
  );
}
