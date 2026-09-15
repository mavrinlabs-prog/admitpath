# SECURITY INCIDENT — AdmitPath Exposed API Keys

**Severity:** CRITICAL  
**Discovered:** 2026-04-22  
**Status:** Keys removed from source files. Git history still contains them. User rotation required.

---

## What Happened

Prior Claude Code sessions and/or build instructions committed 27+ Groq API keys (gsk_*) and other secrets directly into source files. These keys were subsequently removed from the working files but the git commit history still contains them in plaintext.

Additionally, a master build document (`ULTIMATE_COFOUNDER_BUILD_INSTRUCTIONS.txt`) stored in the project's parent directory contained ALL service credentials in plaintext, including:
- 1 Stripe live secret key (sk_live_*)
- 42 Groq API keys (gsk_*)
- 1 Cerebras API key (csk-*)
- 12 Resend email keys (re_*)

---

## Exposed Keys (Masked)

### Groq (console.groq.com) — ROTATE ALL
Keys pattern: `gsk_[A-Z0-9]{20,}` — 27 keys confirmed in git history for this app.
All keys in the format `GROQ_API_KEY_1` through `GROQ_API_KEY_27` are compromised.

### Cerebras (cloud.cerebras.ai) — ROTATE
Key pattern: `csk-[a-z0-9]{40+}` — 1 key exposed in master_overview.docx and build instructions.
Key prefix: `csk-mvfd32f3p2...` (partial, do not use this key)

### Stripe (dashboard.stripe.com) — ROTATE
Key pattern: `sk_live_51RLYZt...` — live key exposed in build instructions.
**This is a live payment key. Rotate immediately and check for unauthorized charges.**

### Resend (resend.com/api-keys) — ROTATE ALL 4
Keys exposed for AdmitPath app:
- re_FAmFiMmq (AdmitPath key 1)
- re_T7PEAUG8 (AdmitPath key 2)
- re_jpHcJDKy (AdmitPath key 3)
- re_asEHadj7 (AdmitPath key 4)

---

## Required User Actions (do immediately)

### Step 1 — Rotate Groq Keys
1. Go to https://console.groq.com
2. Navigate to API Keys
3. Delete ALL existing keys (all 42 across all apps)
4. Generate 15 fresh keys for AdmitPath
5. Generate 15 fresh keys for each other app
6. Update in Vercel environment variables

### Step 2 — Rotate Cerebras Key
1. Go to https://cloud.cerebras.ai
2. Navigate to API Keys
3. Revoke the existing csk-* key
4. Generate a new key
5. Update CEREBRAS_API_KEY in Vercel

### Step 3 — Rotate Stripe Live Key (URGENT)
1. Go to https://dashboard.stripe.com/apikeys
2. Click "Roll key" on the live secret key
3. Copy the new key
4. Update STRIPE_SECRET_KEY in Vercel
5. **Also check Stripe Dashboard > Events for any suspicious charges**

### Step 4 — Rotate Resend Keys
1. Go to https://resend.com/api-keys
2. Delete all 4 AdmitPath keys (re_FAmFiMmq, re_T7PEAUG8, re_jpHcJDKy, re_asEHadj7)
3. Generate 4 new keys
4. Update RESEND_API_KEY in Vercel

### Step 5 — Verify Git History Clean After Rotation
Run this command in the AdmitPath git repo to confirm no keys remain reachable:
```bash
git log -p --all | grep -iE "sk_live_|gsk_[A-Za-z0-9]{20,}|csk-[a-z0-9]{30,}|re_[A-Za-z0-9]{8,}"
```
If output is non-empty, consider rewriting git history with `git filter-repo` or treat the repo as permanently compromised and start a fresh repo.

### Step 6 — Delete or Secure the Plaintext Credential Document
File: `ULTIMATE_COFOUNDER_BUILD_INSTRUCTIONS.txt` (in Downloads or project folder)
This file contains all live credentials in plaintext. Delete it or move it to an encrypted vault (1Password, Bitwarden, etc.) immediately.

---

## Timeline

| Date | Event |
|------|-------|
| Before 2026-04-21 | Keys committed to source files in git |
| 2026-04-21 | Keys removed from source files (but remain in git history) |
| 2026-04-22 | Incident discovered and documented |
| **NOW** | User must rotate all keys per steps above |

---

## Post-Incident Controls

- All new keys loaded from environment variables only (`.env.local` locally, Vercel env vars in production)
- `lib/groq.ts` uses `GROQ_API_KEY_1` through `GROQ_API_KEY_30` — never hardcoded
- `.env.example` lists all required vars without values
- Pre-commit hook recommended: `git secrets --scan` to prevent future leaks

---

## Contact
If unauthorized usage is detected on Groq, contact support@groq.com  
If unauthorized charges are detected on Stripe, contact support@stripe.com immediately
