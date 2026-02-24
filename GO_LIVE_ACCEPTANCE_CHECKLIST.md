# Go-Live Acceptance Checklist (Supabase + Vercel)

## Smoke Test Summary (Local: 2026-02-14)

- Environment: Windows + Next.js dev server on `http://localhost:5000`
- Dev server startup: ✅ Passed
- Frontend products page render (`/products`): ✅ Passed (HTTP 200)
- Frontend products API (`/api/products?limit=5`): ✅ Passed (HTTP 200, `success=true`)
- Admin auth login (`/api/admin/login`, password `admin123` in development): ✅ Passed (HTTP 200)
- Admin products list/create API (`/api/admin/products`): ✅ Passed (HTTP 200)
- Health API (`/api/health`): ✅ Passed (`envStatus=configured`, `dbStatus=connected`)
- Admin product update/delete (`/api/admin/products/:id`): ✅ Passed (HTTP 200)
- Admin bulk delete (`/api/admin/products/bulk`): ✅ Passed (HTTP 200)
- Blog admin publish flow (`/api/admin/blog` create + publish + delete): ✅ Passed (HTTP 200)
- Public blog verification (`/api/blog`, `/blog/[slug]`): ✅ Passed (newly published post visible)
- Admin protection checks: ✅ Passed (`/api/admin/products` unauth=401, `/admin/products` redirected to `/admin/login`)

### Resolution Confirmed
The previous env-related blocker has been resolved and backend write path now uses service role:

- `COZE_SUPABASE_URL` / `COZE_SUPABASE_ANON_KEY`: configured
- `COZE_SUPABASE_SERVICE_ROLE_KEY`: configured and used by admin products APIs

Confirmed via:
- `GET /api/health` (configured + connected)
- successful admin products CRUD and bulk-delete requests

---

## Pre-Go-Live Checklist (Must Pass)

### 1) Vercel Environment Variables
Set in Vercel Project Settings → Environment Variables (Production + Preview as needed):

- `COZE_SUPABASE_URL`
- `COZE_SUPABASE_ANON_KEY`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_SITE_URL`

Acceptance criteria:
- `GET /api/health` returns:
  - `environment.envStatus = configured`
  - `database.dbStatus = connected`

### 2) Database Readiness (Supabase)
- Ensure required tables exist and are queryable by current app APIs:
  - `products`
  - blog-related tables used by admin/blog routes
- Ensure RLS/policies match current API behavior.

Acceptance criteria:
- `GET /api/products` returns `200` with valid JSON payload
- `GET /api/admin/products` returns `200` after admin login

### 3) Admin Product CRUD E2E
- Login at `/admin/login`
- Create product in `/admin/products/new`
- Verify product appears in `/admin/products`
- Edit same product in `/admin/products/edit/[id]`
- Delete product (single and/or bulk)

Acceptance criteria:
- Create/Update/Delete all return success and reflect immediately in list UI
- No 500 errors in server logs

### 4) Frontend Product Consistency
- Visit `/products`
- Open at least one product detail page
- Validate display fields:
  - name/category/subcategory
  - price formatting
  - stock status
  - images/features/specifications (when present)

Acceptance criteria:
- No duplicate currency symbols
- No snake_case/camelCase rendering regressions

### 5) Blog Admin/Frontend Consistency
- Create/edit/publish blog post in admin
- Verify listing and detail page display on frontend

Acceptance criteria:
- Published filtering works correctly
- Detail page fields render without schema errors

### 6) Security & Access Control
- Verify unauthenticated requests to `/admin/*` are redirected/blocked
- Verify production requires explicit `ADMIN_PASSWORD` (no insecure fallback)

Acceptance criteria:
- Admin routes protected by session middleware
- Login fails safely when production password is missing

### 7) Build & Deployment
- Run `pnpm build` successfully in CI/Vercel
- Deploy Preview and Production
- Verify runtime logs contain no critical API errors

Acceptance criteria:
- Build succeeds
- Core paths (`/`, `/products`, `/blog`, `/admin/login`) return expected responses

### 8) Vercel Production Verification (Command Pack)
Set production domain first (PowerShell):

```powershell
$DOMAIN = "https://your-production-domain.com"
```

Or run one-click script:

```powershell
pwsh ./scripts/verify-vercel-production.ps1 -Domain "https://your-production-domain.com"
# PowerShell 5.1 alternative:
powershell -ExecutionPolicy Bypass -File .\scripts\verify-vercel-production.ps1 -Domain "https://your-production-domain.com"
```

Run checks:

```powershell
# 1) Health
Invoke-RestMethod "$DOMAIN/api/health" | ConvertTo-Json -Depth 6

# 2) Public products API
Invoke-RestMethod "$DOMAIN/api/products?limit=5" | ConvertTo-Json -Depth 6

# 3) Public blog API
Invoke-RestMethod "$DOMAIN/api/blog?limit=5" | ConvertTo-Json -Depth 6

# 4) Frontend pages
(Invoke-WebRequest "$DOMAIN/products").StatusCode
(Invoke-WebRequest "$DOMAIN/blog").StatusCode
(Invoke-WebRequest "$DOMAIN/admin/login").StatusCode

# 5) Admin API unauthenticated protection
try { Invoke-WebRequest "$DOMAIN/api/admin/products" -Method GET | Out-Null; "UNEXPECTED_200" } catch { $_.Exception.Response.StatusCode.value__ }
```

Pass criteria (all required):
- `/api/health` returns `success=true`, `environment.envStatus=configured`, `database.dbStatus=connected`
- `/api/products` returns HTTP 200 and `success=true`
- `/api/blog` returns HTTP 200 and `success=true`
- `/products`, `/blog`, `/admin/login` return HTTP 200
- Unauthenticated `/api/admin/products` returns HTTP 401 (or redirect behavior consistent with security policy)
- Vercel Runtime Logs show no critical errors during above requests

---

## Final Release Gate
Release only when all below are true:

- [x] Health API shows env configured + db connected
- [x] Admin product CRUD fully passes
- [x] Frontend products pages/API fully pass
- [x] Blog admin/frontend publish flow passes
- [x] Admin auth protections verified
- [ ] Vercel production deployment verified with no critical errors

---

## Notes for This Test Round
This round is **near complete** locally: health checks, frontend products API/page, admin product CRUD, and blog admin publish flow all pass after service-role migration. Remaining release gate item is Vercel production deployment verification; command pack and pass criteria are now included above for direct execution.
