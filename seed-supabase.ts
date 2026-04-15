/**
 * seed-supabase.ts  —  One-time data migration to Supabase
 *
 * Run: npx tsx seed-supabase.ts
 *
 * Reads all products from data/products.json and upserts them into the
 * Supabase `products` table. Safe to run multiple times (upsert on ID).
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  || 'https://gqgrpuuisgzmznhwbvdh.supabase.co';
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3JwdXVpc2d6bXpuaHdidmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwODc3ODMsImV4cCI6MjA5MDY2Mzc4M30.d6tBWYbonYkOsuGeB24z6wDpZH0Nksf72v5kpx-awYI';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌  Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🚀  Starting Supabase seed...');

  const dataPath = path.join(process.cwd(), 'data', 'products.json');
  if (!fs.existsSync(dataPath)) {
    console.error('❌  data/products.json not found');
    process.exit(1);
  }

  const raw      = fs.readFileSync(dataPath, 'utf-8').replace(/^\uFEFF/, '');
  const products = JSON.parse(raw) as Record<string, unknown>[];
  console.log(`📦  Loaded ${products.length} products from data/products.json`);

  const BATCH = 500;
  let inserted = 0;

  for (let i = 0; i < products.length; i += BATCH) {
    const chunk = products.slice(i, i + BATCH);
    const { error } = await supabase
      .from('products')
      .upsert(chunk, { onConflict: 'id' });

    if (error) {
      console.error(`❌  Batch ${i}–${i + chunk.length} failed:`, error.message);
      process.exit(1);
    }

    inserted += chunk.length;
    console.log(`✅  Inserted rows ${i + 1}–${inserted}`);
  }

  console.log(`\n🎉  Done! Seeded ${inserted} products into Supabase.`);
}

seed().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
