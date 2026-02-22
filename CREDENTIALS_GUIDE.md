# Credentials Guide – Where to Put Them & How to Get Them

**Put ALL credentials in one file:**

**File:** `.env.local`  
**Location:** Project root (same folder as `package.json`)

```
c:\Users\ADITYA MISHRA\OneDrive\Desktop\assisment\.env.local
```

Create this file if it doesn’t exist. Do **not** commit it to Git (it’s in `.gitignore`).

---

## 1. NextAuth (required for login/session)

| Variable           | Example                    | Where to get it |
|--------------------|----------------------------|------------------|
| `NEXTAUTH_SECRET`  | long random string         | Generate: run `openssl rand -base64 32` in terminal, or use any long random string. |
| `NEXTAUTH_URL`     | `http://localhost:3000`    | For local: use `http://localhost:3000`. For production: use your Vercel URL (e.g. `https://your-app.vercel.app`). |

---

## 2. Google OAuth (for “Login with Google”)

| Variable              | Example                          | Where to get it |
|-----------------------|-----------------------------------|------------------|
| `GOOGLE_CLIENT_ID`    | `xxxxx.apps.googleusercontent.com`| [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID** → Application type: **Web application** → Add **Authorized redirect URI**: `http://localhost:3000/api/auth/callback/google` (use your `NEXTAUTH_URL` + `/api/auth/callback/google`). Copy the **Client ID**. |
| `GOOGLE_CLIENT_SECRET`| `GOCSPX-xxxxx`                   | Same OAuth client → copy **Client secret**. |

---

## 3. MongoDB (required for users & message logs)

| Variable      | Example                                                                 | Where to get it |
|---------------|-------------------------------------------------------------------------|------------------|
| `MONGODB_URI` | `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/mydb?retryWrites=true&w=majority` | [MongoDB Atlas](https://www.mongodb.com/atlas) → Create free cluster → **Connect** → **Connect your application** → copy the connection string. Replace `<password>` with your DB user password and `<dbname>` with a database name (e.g. `unifiedinbox`). |

**If you see `querySrv ENOTFOUND _mongodb._tcp....`:**  
See **[MONGODB_CONNECTION_FIX.md](MONGODB_CONNECTION_FIX.md)** in the project root for step-by-step fix (use the **standard** connection string from Atlas, or switch DNS to 8.8.8.8). Then restart the dev server.

---

## 4. Gemini (for “Generate message” AI)

| Variable         | Example        | Where to get it |
|------------------|----------------|------------------|
| `GEMINI_API_KEY` | `AIza...`      | [Google AI Studio](https://aistudio.google.com/app/apikey) → **Get API key** / Create API key. Copy the key. |

---

## 5. Twilio (WhatsApp sandbox + SMS + SMS OTP)

| Variable                        | Example                 | Where to get it |
|---------------------------------|-------------------------|------------------|
| `TWILIO_ACCOUNT_SID`            | `ACxxxxxxxxxx`           | [Twilio Console](https://console.twilio.com/) → Dashboard → **Account SID**. |
| `TWILIO_AUTH_TOKEN`             | `xxxxxxxxxx`             | Same dashboard → **Auth Token** (click to reveal). |
| `TWILIO_WHATSAPP_SANDBOX_NUMBER`| `whatsapp:+14155238886`  | Twilio Console → **Messaging** → **Try it out** → **Send a WhatsApp message** → Sandbox “From” number (often `+14155238886`). Use format: `whatsapp:+14155238886`. |
| `TWILIO_PHONE_NUMBER`           | `+1234567890`            | Twilio Console → **Phone Numbers** → **Manage** → **Buy a number** (or use existing). E.g. `+15551234567`. Used for SMS and for sending OTP when user signs in with **phone**. |

---

## 6. SMTP (optional – for sending OTP to **email**)

If you skip these, email OTP will only be printed in the server console; you can still sign in by copying the OTP from the terminal.

| Variable     | Example              | Where to get it |
|--------------|----------------------|------------------|
| `SMTP_HOST`  | `smtp.gmail.com`      | Your email provider’s SMTP server (Gmail: `smtp.gmail.com`). |
| `SMTP_PORT`  | `587`                | Usually `587` for TLS. |
| `SMTP_SECURE`| `false`              | Use `false` for port 587. |
| `SMTP_USER`  | `your@gmail.com`     | Your email address. |
| `SMTP_PASS`  | App password         | Gmail: [App Passwords](https://myaccount.google.com/apppasswords). Not your normal password. |
| `SMTP_FROM`  | `your@gmail.com`     | Optional; defaults to `SMTP_USER`. |

---

## Example `.env.local` (fill in your real values)

```env
# NextAuth
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/unifiedinbox?retryWrites=true&w=majority

# Gemini
GEMINI_API_KEY=AIza...

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxx
TWILIO_WHATSAPP_SANDBOX_NUMBER=whatsapp:+14155238886
TWILIO_PHONE_NUMBER=+15551234567

# SMTP (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your@gmail.com
```

---

## Quick checklist

- [ ] Create `.env.local` in project root.
- [ ] Add `NEXTAUTH_SECRET` and `NEXTAUTH_URL`.
- [ ] Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (for Google login).
- [ ] Add `MONGODB_URI` (for users and logs).
- [ ] Add `GEMINI_API_KEY` (for “Generate message”).
- [ ] Add all four `TWILIO_*` variables (for WhatsApp, SMS, and phone OTP).
- [ ] Optionally add `SMTP_*` if you want OTP sent by email.
- [ ] Restart dev server after changing `.env.local`: `npm run dev`.

After this, the site should work at **http://localhost:3000** with login, dashboard, and messaging.
