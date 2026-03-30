# Smart Drive V3

Smart Drive V3 is a Next.js + Prisma MVP for a centralized income-based lending system.

## Run locally

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

## MVP seeded login
- email: `underwriter@smartdrive.local`
- password: `password`

## Jobs
```bash
npm run job:early-warning
```
