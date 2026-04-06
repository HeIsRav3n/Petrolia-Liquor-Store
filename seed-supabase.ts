import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

type ProductRow = {
  id: string | number;
  name?: string;
  description?: string;
  price?: string | number;
  category?: string;
  subcategory?: string;
  type?: string;
  country?: string;
  size?: string;
  image?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('Starting Supabase Ingestion...');
  
  const dataPath = path.join(process.cwd(), 'data', 'products.json');
  const fileData = fs.readFileSync(dataPath, 'utf-8');
  const products = JSON.parse(fileData) as ProductRow[];
  
  // Clean up products mapping to exactly match our Supabase schema
  const formattedProducts = products.map((p) => ({
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
    const { error } = await supabase
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
