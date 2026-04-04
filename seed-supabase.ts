import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gqgrpuuisgzmznhwbvdh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3JwdXVpc2d6bXpuaHdidmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwODc3ODMsImV4cCI6MjA5MDY2Mzc4M30.d6tBWYbonYkOsuGeB24z6wDpZH0Nksf72v5kpx-awYI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('Starting Supabase Ingestion...');
  
  const dataPath = path.join(process.cwd(), 'data', 'products.json');
  const fileData = fs.readFileSync(dataPath, 'utf-8');
  const products = JSON.parse(fileData);
  
  // Clean up products mapping to exactly match our Supabase schema
  const formattedProducts = products.map((p: any) => ({
    original_id: p.id,
    name: p.name || 'Unknown',
    description: p.description || '',
    price: typeof p.price === 'string' ? parseFloat(p.price.replace('$', '')) : Number(p.price) || 0,
    category: p.category || '',
    subcategory: p.subcategory || '',
    type: p.type || '',
    country: p.country || '',
    size: p.size || '',
    image: p.image || '/images/placeholder.jpg'
  }));

  console.log(`Parsed ${formattedProducts.length} items. Uploading in batches...`);

  // Batch insert chunks of 500 to not overload the API payload limits
  const BATCH_SIZE = 500;
  for (let i = 0; i < formattedProducts.length; i += BATCH_SIZE) {
    const chunk = formattedProducts.slice(i, i + BATCH_SIZE);
    
    // UPSERT using original_id to avoid duplications if run multiple times
    const { data, error } = await supabase
      .from('products')
      .upsert(chunk, { onConflict: 'original_id' });
      
    if (error) {
      console.error(`Error uploading batch starting at index ${i}:`, error);
      process.exit(1);
    } else {
      console.log(`Successfully ingested batch ${i} to ${i + chunk.length}`);
    }
  }

  console.log('Finished uploading all products to Supabase Postgres!');
}

seed().catch(console.error);
