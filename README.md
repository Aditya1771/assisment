# Unified Inbox

A Unified Inbox web app: generate AI-powered marketing messages (Gemini) and send them via WhatsApp or SMS (Twilio). Built with Next.js (App Router, TypeScript), NextAuth (Google + Email/Phone OTP), and MongoDB. Theme: blue, white, and black.

## Features

- **Landing page** (public): Hero, product description, feature highlights (WhatsApp & SMS), CTA, footer. Blue/white/black theme, responsive.
- **Auth**: NextAuth with **Google OAuth** and **Credentials (email or phone + OTP)**. OTP generated with Node `crypto` (cryptographically secure). Session (JWT) valid for **1 day**.
- **Dashboard** (protected): Links to WhatsApp Inbox and SMS Inbox.
- **WhatsApp Inbox**: Context input → Generate with Gemini → Editable preview → Send via Twilio WhatsApp (sandbox). Optional message logs in MongoDB.
- **SMS Inbox**: Same flow using Twilio SMS API.
- **Modular structure**: `app/`, `api/`, `components/`, `lib/`, `utils/`, `models/`.

## Credentials / Environment variables

Create a `.env.local` in the project root with the following. **You need these to run without errors:**

### 1. NextAuth

- **`NEXTAUTH_SECRET`** – Random secret for signing JWTs/sessions. Generate with: `openssl rand -base64 32`
- **`NEXTAUTH_URL`** – App URL, e.g. `http://localhost:3000` (local) or your Vercel URL (production)

### 2. Google OAuth (for “Login with Google”)

- **`GOOGLE_CLIENT_ID`** – From [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → Create OAuth 2.0 Client ID (Web application). Add authorized redirect URI: `{NEXTAUTH_URL}/api/auth/callback/google`
- **`GOOGLE_CLIENT_SECRET`** – From the same OAuth client

### 3. MongoDB

- **`MONGODB_URI`** – Connection string, e.g. `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority` (from [MongoDB Atlas](https://www.mongodb.com/atlas))

### 4. Gemini (for AI-generated marketing messages)

- **`GEMINI_API_KEY`** – From [Google AI Studio](https://aistudio.google.com/app/apikey) (or same Google Cloud project with Generative Language API enabled)

### 5. Twilio (WhatsApp sandbox + SMS, and OTP via SMS)

- **`TWILIO_ACCOUNT_SID`** – From [Twilio Console](https://console.twilio.com/)
- **`TWILIO_AUTH_TOKEN`** – From same console
- **`TWILIO_WHATSAPP_SANDBOX_NUMBER`** – WhatsApp sandbox “From” number, e.g. `whatsapp:+14155238886` (Twilio sandbox default) or your sandbox number
- **`TWILIO_PHONE_NUMBER`** – Your Twilio phone number for SMS (e.g. `+1234567890`). Used for sending SMS from the app and for sending OTP via SMS when user signs in with phone

### 6. Email (optional – for OTP when user signs in with email)

If you want OTP sent by email instead of only logging to console:

- **`SMTP_HOST`** – SMTP server (e.g. `smtp.gmail.com`)
- **`SMTP_PORT`** – e.g. `587`
- **`SMTP_SECURE`** – `false` for TLS on 587
- **`SMTP_USER`** – SMTP username / email
- **`SMTP_PASS`** – SMTP password or app password
- **`SMTP_FROM`** (optional) – From address; defaults to `SMTP_USER`

If these are not set, OTP for email/phone is still generated and verified; for email the OTP is only logged in the server console (and for SMS, Twilio is used if configured).

## Run locally

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` and add all variables above (at least NextAuth, MongoDB, and for full flow: Google, Gemini, Twilio; optionally SMTP for email OTP).

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000). Use “Login / Get Started” to sign in with Google or with email/phone + OTP.

## Deployment (Vercel)

1. Push the project to GitHub and import the repo in [Vercel](https://vercel.com).
2. In the project settings, add all the same environment variables (e.g. `NEXTAUTH_URL` = your Vercel URL).
3. Deploy. Ensure MongoDB, Twilio, and Gemini are reachable from Vercel (no extra config usually needed).

## Summary of credentials needed (no errors)

| Purpose              | Variable                     | Required for                         |
|----------------------|-----------------------------|-------------------------------------|
| Auth (session)       | `NEXTAUTH_SECRET`           | All auth                             |
| Auth (URL)           | `NEXTAUTH_URL`              | Callbacks & redirects                |
| Google login         | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google sign-in              |
| Database              | `MONGODB_URI`               | Users, message logs                  |
| AI generation         | `GEMINI_API_KEY`            | Generate message                     |
| WhatsApp + SMS + SMS OTP | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_SANDBOX_NUMBER`, `TWILIO_PHONE_NUMBER` | Send WhatsApp, SMS, and phone OTP |
| Email OTP (optional) | `SMTP_*`                    | Sending OTP to email                 |

Without these set, the app may start but login, generate, or send features will fail until the corresponding env vars are added.
