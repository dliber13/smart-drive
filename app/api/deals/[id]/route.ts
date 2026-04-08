13:37:18.937 Running build in Washington, D.C., USA (East) – iad1
13:37:18.938 Build machine configuration: 2 cores, 8 GB
13:37:19.193 Cloning github.com/dliber13/smart-drive (Branch: main, Commit: 7dfabc6)
13:37:19.644 Cloning completed: 451.000ms
13:37:21.148 Restored build cache from previous deployment (F2rGLRBgrfNZJG1L8xCYWdJfTXUd)
13:37:21.901 Running "vercel build"
13:37:22.495 Vercel CLI 50.38.2
13:37:22.708 Installing dependencies...
13:37:28.719 
13:37:28.719 up to date in 6s
13:37:28.720 
13:37:28.720 44 packages are looking for funding
13:37:28.720   run `npm fund` for details
13:37:28.747 Detected Next.js version: 15.2.6
13:37:28.752 Running "npm run build"
13:37:28.854 
13:37:28.854 > smart-drive-v3@0.2.0 build
13:37:28.854 > prisma generate && next build
13:37:28.855 
13:37:29.974 warn The configuration property `package.json#prisma` is deprecated and will be removed in Prisma 7. Please migrate to a Prisma config file (e.g., `prisma.config.ts`).
13:37:29.974 For more information, see: https://pris.ly/prisma-config
13:37:29.974 
13:37:30.066 Prisma schema loaded from prisma/schema.prisma
13:37:30.524 
13:37:30.525 ✔ Generated Prisma Client (v6.19.3) to ./node_modules/@prisma/client in 264ms
13:37:30.525 
13:37:30.525 Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
13:37:30.525 
13:37:30.526 Tip: Interested in query caching in just a few lines of code? Try Accelerate today! https://pris.ly/tip-3-accelerate
13:37:30.526 
13:37:31.251    ▲ Next.js 15.2.6
13:37:31.252 
13:37:31.268    Creating an optimized production build ...
13:37:36.072  ✓ Compiled successfully
13:37:36.074    Linting and checking validity of types ...
13:37:39.925 Failed to compile.
13:37:39.925 
13:37:39.926 ./app/api/deals/[id]/route.ts:50:9
13:37:39.926 Type error: Object literal may only specify known properties, and 'tier' does not exist in type '(Without<ApplicationUpdateInput, ApplicationUncheckedUpdateInput> & ApplicationUncheckedUpdateInput) | (Without<...> & ApplicationUpdateInput)'.
13:37:39.926 
13:37:39.926 [0m [90m 48 |[39m       data[33m:[39m {[0m
13:37:39.926 [0m [90m 49 |[39m         status[33m:[39m body[33m.[39mstatus[33m,[39m[0m
13:37:39.926 [0m[31m[1m>[22m[39m[90m 50 |[39m         tier[33m:[39m body[33m.[39mtier [33m?[39m[33m?[39m undefined[33m,[39m[0m
13:37:39.927 [0m [90m    |[39m         [31m[1m^[22m[39m[0m
13:37:39.927 [0m [90m 51 |[39m         lender[33m:[39m body[33m.[39mlender [33m?[39m[33m?[39m undefined[33m,[39m[0m
13:37:39.927 [0m [90m 52 |[39m         maxPayment[33m:[39m body[33m.[39mmaxPayment [33m?[39m[33m?[39m undefined[33m,[39m[0m
13:37:39.927 [0m [90m 53 |[39m         maxVehicle[33m:[39m body[33m.[39mmaxVehicle [33m?[39m[33m?[39m undefined[33m,[39m[0m
13:37:39.947 Next.js build worker exited with code: 1 and signal: null
13:37:39.967 Error: Command "npm run build" exited with 1
