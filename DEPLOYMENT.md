# Smart Drive V3 Deployment

## Recommended stack
- Vercel
- Neon Postgres
- Prisma
- Auth.js
- S3-compatible object storage

## Local verification
```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

## Production prep
1. Push repo to GitHub.
2. Import into Vercel.
3. Add env vars from `.env.production.example`.
4. Set production domain.
5. Run:
```bash
npx prisma generate
npx prisma migrate deploy
```

## Vercel settings
- Install Command: `npm install`
- Build Command: `npx prisma generate && next build`

## Optional stronger build command
```bash
npx prisma generate && npx prisma migrate deploy && next build
```

## Smoke test
- login works
- dashboard loads
- underwriting queue loads
- scoring runs
- vehicle matches return
- decision creates deal
- funding checklist saves
- funding releases
- document upload works
- signed download works
- admin users page works
- job runner executes

## Seeded MVP login
- email: `underwriter@smartdrive.local`
- password: `password`
