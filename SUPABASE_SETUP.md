# Supabase Database & Authentication Setup

I have wired up your Next.js application to use **Supabase** for user authentication (Sign Up / Sign In) and database storage.

Right now, the code is ready, but it needs your unique Supabase keys to connect to your database.

## How to activate it:

1. Go to [Supabase](https://supabase.com) and click **"Start your project"** (it's free).
2. Create a new project. You will be asked to create a database password—save this somewhere safe.
3. Once your project is created, go to **Project Settings** (the gear icon) > **API** (under Configuration).
4. You will see two important keys here:
   - **Project URL**
   - **Project API Keys (anon / public)**
5. In your code editor, create a new file named `.env.local` inside the `petrolia-liquor-store` folder.
6. Copy the contents of `.env.local.example` into your new `.env.local` file and replace the placeholder text with your actual keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUz...
   ```
7. Restart your development server (`npm run dev`).

## Managing Users

Once the above is done, anyone who signs up on your website will appear in your Supabase Dashboard under **Authentication > Users**.
From there, you can manage them, reset passwords, and set up email templates!