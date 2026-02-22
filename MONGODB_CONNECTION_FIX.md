# Fix: querySrv ENOTFOUND (MongoDB Atlas)

If you see this error when signing in or using the app:

```text
querySrv ENOTFOUND _mongodb._tcp.codingbaba1771.hrt5lwo.mongodb.net
```

it means your PC or network cannot resolve MongoDB Atlas’s SRV hostname. Your cluster **CodingBaba1771** and database **assisment** are fine; the issue is DNS or connection string format.

Use **one** of the two solutions below.

---

## Solution 1: Use the standard (non-SRV) connection string (recommended)

This avoids SRV lookups entirely.

1. Open [MongoDB Atlas](https://cloud.mongodb.com) and go to **Database** → your cluster **CodingBaba1771**.
2. Click **Connect** on the cluster.
3. Choose **Drivers** (or “Connect your application”).
4. Set **Driver** to **Node.js** and pick a **version**.
5. In the connection string / code sample:
   - If you see a **connection string only** or a **“Standard” / “Legacy”** option, use that (it starts with `mongodb://` and has several hosts like `cluster-shard-00-00.xxx.mongodb.net:27017`).
   - If you only see the SRV string (`mongodb+srv://...`), try changing the **Driver version** to an **older / “Non-Stable”** option; Atlas often shows the **standard** (non-SRV) string for older drivers. Copy that full string.
6. It will look like:
   ```text
   mongodb://USERNAME:PASSWORD@codingbaba1771-shard-00-00.hrt5lwo.mongodb.net:27017,codingbaba1771-shard-00-01.hrt5lwo.mongodb.net:27017,codingbaba1771-shard-00-02.hrt5lwo.mongodb.net:27017/assisment?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin
   ```
7. Replace `USERNAME` and `PASSWORD` with your database user. If the password has `@`, `#`, `:`, or `%`, [URL-encode](https://www.w3schools.com/tags/ref_urlencode.asp) them (e.g. `@` → `%40`).
8. Use **assisment** (or your DB name) before the `?` as the database name.
9. In your project, open **`.env.local`** and set:
   ```env
   MONGODB_URI=<paste the full standard string here>
   ```
   No quotes, no extra spaces. One line only.
10. Restart the dev server (`npm run dev`).

---

## Solution 2: Use a DNS server that supports SRV (e.g. Google DNS)

If you prefer to keep using the `mongodb+srv://...` string:

1. On Windows: **Settings** → **Network & Internet** → **Wi‑Fi** (or Ethernet) → **Hardware properties** → **Edit** next to “DNS server assignment” → set **Manual** and add:
   - **Preferred DNS:** `8.8.8.8` (Google)
   - **Alternate DNS:** `8.8.4.4` (optional)
2. Save and restart the dev server.

Then try “Continue with Google” again. If it still fails, use **Solution 1** (standard connection string).

---

## “Could not connect… IP isn’t whitelisted”

If you see this error, your IP is not in Atlas **Network Access**:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) → select the **project** that has your cluster.
2. Left sidebar → **Network Access** (under Security).
3. Click **Add IP Address** → **Allow Access from Anywhere** (adds `0.0.0.0/0`) → Confirm.
4. Wait 1–2 minutes, then try signing in again.

Use “Allow from anywhere” only for development. For production, add only your server’s IP.

---

## Checklist

- [ ] **Network Access:** Atlas → **Network Access** → ensure your IP (or “Allow access from anywhere” for testing) is in the list.
- [ ] **Database user:** Atlas → **Database Access** → user has read/write on the cluster; use that username/password in the connection string.
- [ ] **Cluster state:** Cluster is **Active** (not Paused). If paused, click **Resume**.
- [ ] **Restart:** After changing `.env.local`, stop and run `npm run dev` again.

After applying Solution 1 or 2, the `querySrv ENOTFOUND` error should stop and login should work.
