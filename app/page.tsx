import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-ink-200 bg-white/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">Unified Inbox</span>
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-ink-600 hover:text-primary-600 transition">
              Features
            </a>
            <a href="#about" className="text-ink-600 hover:text-primary-600 transition">
              About
            </a>
            <Link
              href="/auth/signin"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
            >
              Login / Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-primary-50 to-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-ink-900 text-center max-w-4xl leading-tight">
          AI-powered marketing messages, delivered via{" "}
          <span className="text-primary-600">WhatsApp</span> &{" "}
          <span className="text-primary-600">SMS</span>
        </h1>
        <p className="mt-6 text-lg text-ink-600 text-center max-w-2xl">
          Create engaging copy with Gemini AI and send it to your audience in one click. One inbox for both channels.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            href="/auth/signin"
            className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition shadow-lg shadow-primary-500/25"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="border-2 border-ink-800 text-ink-800 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-ink-800 hover:text-white transition"
          >
            See features
          </a>
        </div>
      </section>

      {/* Product description */}
      <section id="about" className="py-20 px-4 bg-ink-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">One place for all your outreach</h2>
          <p className="text-ink-300 text-lg">
            Unified Inbox lets you write marketing messages with AI, preview and edit them, then send via WhatsApp (Twilio sandbox) or SMS. No switching tools—context in, message out, delivery in one flow.
          </p>
        </div>
      </section>

      {/* Feature highlights */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-ink-900 text-center mb-14">
            Feature highlights
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-8 rounded-2xl border-2 border-primary-200 bg-primary-50/50">
              <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white text-2xl">
                💬
              </div>
              <h3 className="mt-4 text-xl font-bold text-ink-900">WhatsApp Inbox</h3>
              <p className="mt-2 text-ink-600">
                Generate copy with Gemini, edit the preview, and send via Twilio WhatsApp sandbox. Optional message logs stored in MongoDB.
              </p>
              <Link
                href="/auth/signin"
                className="inline-block mt-4 text-primary-600 font-medium hover:underline"
              >
                Go to WhatsApp →
              </Link>
            </div>
            <div className="p-8 rounded-2xl border-2 border-ink-200 bg-ink-50/50">
              <div className="w-12 h-12 rounded-xl bg-ink-800 flex items-center justify-center text-white text-2xl">
                📱
              </div>
              <h3 className="mt-4 text-xl font-bold text-ink-900">SMS Inbox</h3>
              <p className="mt-2 text-ink-600">
                Same workflow: context → AI-generated message → editable preview → send via Twilio SMS. Clean UI and error handling.
              </p>
              <Link
                href="/auth/signin"
                className="inline-block mt-4 text-primary-600 font-medium hover:underline"
              >
                Go to SMS →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to unify your inbox?</h2>
          <p className="text-primary-100 text-lg mb-8">
            Sign in with Google or use email/phone + OTP. Start sending in minutes.
          </p>
          <Link
            href="/auth/signin"
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-ink-100 transition"
          >
            Login / Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-200 bg-ink-50 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-semibold text-ink-800">Unified Inbox</span>
          <p className="text-ink-600 text-sm">
            Next.js · NextAuth · Gemini · Twilio · MongoDB · Blue, White & Black theme
          </p>
        </div>
      </footer>
    </div>
  );
}
