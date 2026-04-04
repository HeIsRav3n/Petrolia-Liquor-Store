# Deployment Instructions

## 9️⃣ Staging Deployment

For staging, we recommend using **Vercel** or **Netlify** since this is a Next.js application.

1. Push your code to a GitHub repository (e.g., `main` or a specific `staging` branch).
2. Connect your GitHub account to Vercel.
3. Select the `petrolia-liquor-store` repository.
4. Vercel will automatically detect it is a Next.js project and configure the build settings (`npm run build`).
5. Set any necessary Environment Variables (if added later) in the Vercel dashboard.
6. Deploy. Vercel will provide a staging URL (e.g., `petrolia-liquor-store-staging.vercel.app`).

## 🔟 Production Launch

Once staging is verified and the client approves:

1. In your Vercel (or hosting) dashboard, add your custom domain (e.g., `petrolialiquor.com`).
2. Update your DNS settings (A Record / CNAME) as instructed by Vercel.
3. Ensure SSL (HTTPS) is successfully provisioned.
4. Do a final pass on the live URL to ensure all SVGs, theme toggles, and cart functions operate correctly on the production domain.