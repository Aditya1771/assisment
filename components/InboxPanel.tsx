"use client";

import { useState, useEffect } from "react";

type Channel = "whatsapp" | "sms";

export default function InboxPanel({ channel }: { channel: Channel }) {
  const [context, setContext] = useState("");
  const [preview, setPreview] = useState("");
  const [to, setTo] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [logs, setLogs] = useState<Array<{ to: string; body: string; status: string; createdAt: string; channel: string }>>([]);

  async function fetchLogs() {
    try {
      const res = await fetch("/api/logs");
      const data = await res.json();
      if (res.ok && data.logs)
        setLogs(data.logs.filter((l: { channel: string }) => l.channel === channel));
    } catch (_) {}
  }

  useEffect(() => {
    fetchLogs();
  }, [channel]);

  function showNotif(type: "success" | "error", message: string) {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }

  async function handleGenerate() {
    if (!context.trim()) {
      showNotif("error", "Please enter context.");
      return;
    }
    setGenerating(true);
    setNotification(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: context.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.error ?? "Generate failed";
        const debugHint = data.debug?.hint;
        throw new Error(debugHint ? `${msg} — ${debugHint}` : msg);
      }
      setPreview(data.message ?? "");
      showNotif("success", "Message generated. Edit if needed, then send.");
    } catch (e) {
      showNotif("error", e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSend() {
    if (!preview.trim()) {
      showNotif("error", "Generate a message first.");
      return;
    }
    const recipient = to.trim();
    if (!recipient) {
      showNotif("error", "Enter recipient number.");
      return;
    }
    setSending(true);
    setNotification(null);
    try {
      const endpoint = channel === "whatsapp" ? "/api/send/whatsapp" : "/api/send/sms";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipient,
          body: preview,
          context: context.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Send failed");
      showNotif("success", "Message sent successfully.");
      setPreview("");
      setTo("");
      void fetchLogs();
    } catch (e) {
      showNotif("error", e instanceof Error ? e.message : "Failed to send");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-8">
      {notification && (
        <div
          className={`p-4 rounded-xl ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-ink-200 p-6 shadow-sm">
        <label className="block text-sm font-medium text-ink-700 mb-2">
          Context for marketing message
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g. Summer sale 30% off on all items, valid this weekend"
          rows={3}
          className="w-full px-4 py-3 border border-ink-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="mt-4 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 disabled:opacity-50 transition"
        >
          {generating ? "Generating…" : "Generate message"}
        </button>
      </div>

      {preview && (
        <div className="bg-white rounded-2xl border border-ink-200 p-6 shadow-sm">
          <label className="block text-sm font-medium text-ink-700 mb-2">
            Editable preview
          </label>
          <textarea
            value={preview}
            onChange={(e) => setPreview(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border border-ink-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
          />
          <div className="mt-4 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Recipient {channel === "whatsapp" ? "(e.g. +1234567890)" : "(phone number)"}
              </label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder={channel === "whatsapp" ? "+1234567890" : "+1234567890"}
                className="w-full px-4 py-3 border border-ink-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleSend}
              disabled={sending}
              className="px-6 py-3 bg-ink-800 text-white rounded-xl font-medium hover:bg-ink-900 disabled:opacity-50 transition"
            >
              {sending ? "Sending…" : `Send via ${channel === "whatsapp" ? "WhatsApp" : "SMS"}`}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-ink-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-ink-900">Sent message logs</h3>
          <button
            type="button"
            onClick={fetchLogs}
            className="text-sm text-primary-600 hover:underline"
          >
            Refresh
          </button>
        </div>
        {logs.length === 0 ? (
          <p className="text-ink-500 text-sm">No logs yet. Send a message to see them here.</p>
        ) : (
          <ul className="space-y-3 max-h-60 overflow-y-auto">
            {logs.map((log, i) => (
              <li
                key={i}
                className="text-sm p-3 rounded-lg bg-ink-50 border border-ink-100"
              >
                <span className="font-medium text-ink-700">To: {log.to}</span>
                <span className={`ml-2 ${log.status === "sent" ? "text-green-600" : "text-red-600"}`}>
                  {log.status}
                </span>
                <p className="mt-1 text-ink-600 truncate">{log.body}</p>
                <p className="text-ink-400 text-xs mt-1">{new Date(log.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
