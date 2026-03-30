# Deployment Checklist

## Infrastructure
- [ ] Vercel project created
- [ ] Neon database created
- [ ] S3 bucket created
- [ ] Secrets added in Vercel
- [ ] Production domain connected

## Database
- [ ] `prisma generate` run
- [ ] `prisma migrate deploy` run
- [ ] Initial admin users created
- [ ] Production seed strategy confirmed

## App verification
- [ ] Login
- [ ] Dashboard
- [ ] Underwriting
- [ ] Dealer portal
- [ ] Funding queue
- [ ] Portfolio
- [ ] Admin users
- [ ] Jobs
- [ ] Integrations test
- [ ] Document upload/download

## Security
- [ ] Demo passwords replaced
- [ ] AUTH_SECRET rotated
- [ ] DB secret rotated
- [ ] S3 secret rotated
- [ ] JOB_SECRET added
