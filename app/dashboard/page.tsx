import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-2">Dashboard</h1>
      <p className="text-ink-600 mb-10">
        Choose an inbox to generate AI marketing messages and send them.
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        <Link
          href="/dashboard/whatsapp"
          className="block p-8 rounded-2xl border-2 border-primary-200 bg-white hover:border-primary-400 hover:shadow-lg transition"
        >
          <span className="text-4xl">💬</span>
          <h2 className="mt-4 text-xl font-bold text-ink-900">WhatsApp Inbox</h2>
          <p className="mt-2 text-ink-600">
            Generate copy with Gemini and send via Twilio WhatsApp sandbox.
          </p>
          <span className="inline-block mt-4 text-primary-600 font-medium">
            Open WhatsApp Inbox →
          </span>
        </Link>
        <Link
          href="/dashboard/sms"
          className="block p-8 rounded-2xl border-2 border-ink-200 bg-white hover:border-ink-400 hover:shadow-lg transition"
        >
          <span className="text-4xl">📱</span>
          <h2 className="mt-4 text-xl font-bold text-ink-900">SMS Inbox</h2>
          <p className="mt-2 text-ink-600">
            Same workflow: AI-generated message, then send via Twilio SMS.
          </p>
          <span className="inline-block mt-4 text-primary-600 font-medium">
            Open SMS Inbox →
          </span>
        </Link>
      </div>
    </div>
  );
}
