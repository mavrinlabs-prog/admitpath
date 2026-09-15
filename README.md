# AdmitPath

AI college counselor — college matching, essay feedback, 30/60/90-day action plans.

## Rate Limiting
Current implementation uses in-memory Map (resets on cold start). 
For production, replace with Upstash Redis: https://upstash.com
Add UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to Vercel env vars.
