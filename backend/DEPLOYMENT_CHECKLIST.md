# Pre-Deployment Environment Variable Checklist

Every variable currently in `backend/.env` and `storefront/.env.local`, and what
needs to happen to it before going live.

## Legend

- 🔄 **Safe to regenerate fresh** — no external dependency, just generate a new production value
- 🚨 **MUST be replaced with a real value** — points at a test/dev/personal resource right now
- ✅ **Fine as-is** — reviewed, no change needed for launch

---

## `backend/.env`

| Variable | Current (dev) | Status | What needs to happen |
|---|---|---|---|
| `JWT_SECRET` | placeholder string `change_me_at_least_32_chars_long` | 🔄 Safe to regenerate | Generate a new random 32+ char secret for production (e.g. `openssl rand -base64 48`). Currently a literal placeholder — a real security hole if deployed as-is. |
| `COOKIE_SECRET` | placeholder string `change_me_at_least_32_chars_long` | 🔄 Safe to regenerate | Same as `JWT_SECRET` — generate a new random secret, don't reuse the dev value. |
| `MEDUSA_ADMIN_ONBOARDING_TYPE` | `default` | ✅ Fine as-is | Onboarding flag only, no production impact. |
| `MEDUSA_BACKEND_URL` | `http://localhost:9000` | 🚨 MUST be replaced | Real deployed backend URL, once Railway (or wherever) is set up. |
| `STORE_CORS` | `http://localhost:3000` | 🚨 MUST be replaced | Deployed storefront origin — left as localhost, the live storefront can't call the backend at all. |
| `ADMIN_CORS` | `http://localhost:3000` | 🚨 MUST be replaced | Deployed admin origin (same domain as storefront unless admin is hosted separately). |
| `AUTH_CORS` | `http://localhost:3000` | 🚨 MUST be replaced | Same as above. |
| `DATABASE_URL` | local Postgres (`localhost:5432`) | 🚨 MUST be replaced | Hosted production Postgres connection string. |
| `RAZORPAY_KEY_ID` | currently set (test mode key, `rzp_test_...`) | 🚨 MUST be replaced | Client's live key, once Razorpay KYC is approved. |
| `RAZORPAY_KEY_SECRET` | currently set (test mode secret) | 🚨 MUST be replaced | Client's live secret, paired with the live key ID above. |
| `RESEND_API_KEY` | currently set (developer's personal Resend account) | 🚨 MUST be replaced | Client's own Resend account key. |
| `OWNER_NOTIFICATION_EMAIL` | currently placeholder (`jivesh.nazar@gmail.com`) | 🚨 MUST be replaced | Client's real inbox for "new order received" alerts. |

## `storefront/.env.local`

| Variable | Current (dev) | Status | What needs to happen |
|---|---|---|---|
| `NEXT_PUBLIC_MEDUSA_URL` | `http://localhost:9000` | 🚨 MUST be replaced | Real deployed backend URL, once Railway is set up. |
| `NEXT_PUBLIC_STORE_URL` | `http://localhost:3000` | 🚨 MUST be replaced | Production storefront domain. |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | currently set, generated against the **local dev database** | 🚨 MUST be replaced | Publishable keys are scoped to a specific database + sales channel — this one won't exist in the production DB. Generate a new one in the production Medusa admin after deploy. Easy to miss: the storefront looks fine until checkout calls start failing. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `thx8mokj` (developer's personal Cloudinary account) | ✅ Fine as-is | Not a secret — a public cloud name baked into public asset URLs. Business question, not a security one: decide whether to migrate product photos/videos to a Cloudinary account the client owns, or keep depending on the developer's account. |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | currently set (test mode key, matches backend's) | 🚨 MUST be replaced | Must match the backend's live `RAZORPAY_KEY_ID` exactly — a mismatch breaks checkout with a Razorpay error. |
| `NEXT_PUBLIC_DEFAULT_REGION` | `in` | ✅ Fine as-is | India-only store — no change needed. |
| `RESEND_API_KEY` | currently set (developer's personal Resend account, separate key from backend's) | 🚨 MUST be replaced | Client's own Resend account key. |
| `EMAIL_FROM` | `onboarding@resend.dev` (Resend sandbox sender) | 🚨 MUST be replaced | Once a domain is verified in the client's Resend account, switch to a verified sender on that domain. Sandbox mode can currently only deliver to the Resend account's own signup address — it silently blocks the contact form and owner notification for any other recipient. |
| `OWNER_NOTIFICATION_EMAIL` | currently placeholder (`jivesh.nazar@gmail.com`) | 🚨 MUST be replaced | Client's real inbox — the contact form delivers here too. Keep in sync with the backend's value above. |

---

## Known blocker (not an env swap, flag to client)

Both the owner-notification email (on `order.placed`) and the contact form
send from Resend's sandbox address (`onboarding@resend.dev`). Sandbox mode
can only deliver to the Resend account's own signup email — not to arbitrary
recipients. Right now that happens to work because `OWNER_NOTIFICATION_EMAIL`
is set to the developer's own address (the account's signup email). The
moment `OWNER_NOTIFICATION_EMAIL` and `RESEND_API_KEY` are swapped to the
client's real account, delivery will keep working **only if** a domain has
also been verified in that Resend account and `EMAIL_FROM` points to it —
otherwise both email flows will start silently failing again.
