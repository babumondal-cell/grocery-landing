---
name: Supabase TCP blocked in Replit sandbox
description: Direct PostgreSQL TCP connections to Supabase are blocked; workaround is the Supabase JS client.
---

# Supabase TCP blocked

Replit's sandbox blocks outbound TCP to Supabase's database ports (5432 and 6543). `drizzle-kit push` hangs silently. `pg` client cannot connect.

**Why:** Network sandbox restricts raw TCP to external hosts on database ports.

**How to apply:** Use `@supabase/supabase-js` (REST-based) in the API server instead of Drizzle ORM for querying. Tables must be created manually via the Supabase Dashboard SQL Editor — provide the user with the SQL to run. The `lib/db` Drizzle schema files are still useful as source-of-truth documentation but cannot be pushed automatically.

The Supabase REST API (`SUPABASE_URL/rest/v1/...`) works fine. The Management API (`api.supabase.com`) requires a personal access token (not the service role key).
