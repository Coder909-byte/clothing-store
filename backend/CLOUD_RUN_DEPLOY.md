# Deploying the backend to Google Cloud Run

Everything here is prepared and ready; nothing has been run yet — there's no
live GCP project to run it against. This is the exact sequence to execute
once the client's Google Cloud account exists.

## What I need from the client first

1. **Project ID** (not the project *name* — the ID, e.g. `dont-tell-mama-prod`, shown in the GCP Console header/URL once the project is created).
2. **Billing enabled on that project.** Cloud Run's free tier only applies *within* a billing-enabled project — GCP requires a card on file even though we're staying inside the free monthly quota (2M requests / 360,000 GiB-seconds / 180,000 vCPU-seconds).
3. **Access to run the deploy**, either:
   - She (or whoever owns the account) adds me/you as a project member with the `Editor` role (simplest — Console → IAM & Admin → Grant Access), or
   - She runs the commands below herself in **Google Cloud Shell** (console.cloud.google.com → the `>_` icon top-right) — it's browser-based with `gcloud` already installed and authenticated, zero local setup, and she pastes the output back here.

I don't have `gcloud` installed in this environment yet — I'll install and run it directly once I have project access, or walk through/verify output if the client runs it herself in Cloud Shell.

---

## 1. Authenticate & select the project

```bash
gcloud auth login
gcloud config set project <PROJECT_ID>
```

## 2. Enable required APIs (one-time per project)

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com
```

## Note: no local Docker needed

`gcloud run deploy --source .` uploads the source and builds the image via
Cloud Build **on Google's servers** — Docker doesn't need to be installed
locally at all. (This also sidesteps an Apple Silicon trap: if you ever
build the image locally with `docker build` on an M-series Mac and push it
manually instead, it'll be arm64 and Cloud Run requires amd64 — stick to
`--source .` and this never comes up.)

## 3. First deploy — from the **repo root** (the Dockerfile depends on the pnpm workspace files living there)

```bash
cd dont-tell-mama   # repo root, where /Dockerfile lives

gcloud run deploy dont-tell-mama-backend \
  --source . \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --port 8080 \
  --set-env-vars NODE_OPTIONS="--max-old-space-size=896"
```

Notes on the flags:
- `--region asia-southeast1` — matches the Render Postgres instance (Singapore), keeping DB latency low. Change if the client wants a different region; just keep the DB and backend close together.
- `--memory 1Gi` — this is the actual fix: double Render's 512MB ceiling, which is what the SIGKILL evidence says Medusa v2 needs to complete startup.
- `--min-instances 0` — **required to stay free.** An always-warm instance at 1GiB would burn the entire 360,000 GiB-second monthly quota (~100 hours) in about 4 days, then start incurring real charges. At 0, you pay/use quota only while actively serving a request; the trade-off is a cold start (Medusa's DI/ORM bootstrap, likely several seconds) on the first request after a period of no traffic — comparable to or better than the spin-down behavior Render's free tier already has today.
- `NODE_OPTIONS=--max-old-space-size=896` — leaves ~128MB headroom for non-heap RSS inside the 1Gi container, same reasoning as the Render tuning, just against a bigger ceiling. If you later resize `--memory`, recompute this as roughly `(memory_in_MB - 130)`.

This first deploy will **fail or come up broken on CORS/backend-URL** — that's expected. Cloud Run assigns the service URL only after this first deploy, and we need that URL to set `MEDUSA_BACKEND_URL`/CORS correctly, which requires a second deploy (step 5).

## 4. Set the real environment variables

Grab the same values already verified for Render, plus the DB connection.
**Use the Render Postgres EXTERNAL connection string here** — Cloud Run is a
different cloud and cannot reach Render's private internal network. The
`medusa-config.ts` SSL fix already made handles this automatically (SSL is
now enabled whenever `DATABASE_URL` isn't `localhost`), so the external
string works as-is, no `?sslmode=` suffix needed.

```bash
gcloud run services update dont-tell-mama-backend \
  --region asia-southeast1 \
  --set-env-vars DATABASE_URL="<Render external Postgres connection string>" \
  --set-env-vars JWT_SECRET="<generate: openssl rand -base64 48>" \
  --set-env-vars COOKIE_SECRET="<generate: openssl rand -base64 48>" \
  --set-env-vars STORE_CORS="https://clothing-store-storefront.vercel.app" \
  --set-env-vars AUTH_CORS="https://clothing-store-storefront.vercel.app" \
  --set-env-vars ADMIN_CORS="https://clothing-store-storefront.vercel.app" \
  --set-env-vars RAZORPAY_KEY_ID="<live or test key per launch status>" \
  --set-env-vars RAZORPAY_KEY_SECRET="<matching secret>" \
  --set-env-vars RESEND_API_KEY="<client's Resend key>" \
  --set-env-vars OWNER_NOTIFICATION_EMAIL="<client's real inbox>"
```

(Secrets like `JWT_SECRET`/`DATABASE_URL` are better stored in **Secret
Manager** and referenced with `--set-secrets` instead of `--set-env-vars` —
more setup, meaningfully more secure. Flagging it; happy to switch to that
if you want it before this goes live rather than after.)

## 5. Get the assigned URL, then set `MEDUSA_BACKEND_URL` and redeploy

```bash
gcloud run services describe dont-tell-mama-backend \
  --region asia-southeast1 --format="value(status.url)"
```

That prints something like `https://dont-tell-mama-backend-xxxxxxxxxx.asia-southeast1.run.app`.

```bash
gcloud run services update dont-tell-mama-backend \
  --region asia-southeast1 \
  --set-env-vars MEDUSA_BACKEND_URL="<the URL printed above>"
```

## 6. Verify

```bash
curl https://<the-url>/health
curl "https://<the-url>/store/products?region_id=<region_id>" \
  -H "x-publishable-api-key: <key>"
```

## Redeploying after a code change

```bash
cd dont-tell-mama
gcloud run deploy dont-tell-mama-backend --source . --region asia-southeast1
```

Env vars persist across redeploys (`--source` deploys don't reset them)
unless you explicitly `--set-env-vars` again.
