const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const csvPath = 'c:\\Users\\RAV3N\\Downloads\\petrolia details.csv';
const outPath = path.join(__dirname, 'data', 'products.json');

const fileContent = fs.readFileSync(csvPath, 'utf-8');
const records = parse(fileContent, {
  columns: true,
  skip_empty_lines: true,
});

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}

function parseSize(title, tags) {
  const match = title.match(/(\d+ml|\d+L|\d+\s*x\s*\d+ml)/i);
  if (match) return match[0];
  if (tags && tags.includes('375ml')) return '375ml';
  if (tags && tags.includes('750ml')) return '750ml';
  return '750ml';
}

function parseCategory(type, tagsStr) {
  const t = (type || '').toLowerCase();
  const tags = (tagsStr || '').toLowerCase();
  
  if (t.includes('wine') || tags.includes('wine')) return 'Wine';
  if (t.includes('beer') || tags.includes('beer')) return 'Beer';
  if (t.includes('vodka') || tags.includes('vodka')) return 'Vodka';
  if (t.includes('whisky') || t.includes('whiskey') || tags.includes('whisky') || tags.includes('whiskey')) return 'Whisky';
  if (t.includes('gin') || tags.includes('gin')) return 'Gin';
  if (t.includes('rum') || tags.includes('rum')) return 'Rum';
  if (t.includes('tequila') || tags.includes('tequila')) return 'Tequila';
  if (t.includes('cooler') || t.includes('cider') || tags.includes('cooler')) return 'Coolers & Ciders';
  
  return 'Spirits';
}

const products = [];
let idCounter = 1;

for (const row of records) {
  if (!row.Title || !row['Variant Price']) continue;
  
  const price = parseFloat(row['Variant Price']);
  if (isNaN(price)) continue;

  const category = parseCategory(row.Type, row.Tags);
  
  products.push({
    id: idCounter.toString(),
    name: row.Title,
    price: price,
    category: category,
    subcategory: row.Type || '',
    country: '', 
    size: parseSize(row.Title, row.Tags),
    type: row.Type || '',
    image_url: row['Image Src'] || '',
    description: stripHtml(row['Body (HTML)']),
    in_stock: row.Status?.toLowerCase() !== 'draft',
    featured: Math.random() > 0.95, // randomly feature 5% of products
    is_new: Math.random() > 0.95, // randomly mark 5% as new
    is_petrolia_pick: Math.random() > 0.95,
    is_miscellaneous: false,
    created_at: new Date().toISOString().split('T')[0]
  });
  
  idCounter++;
}

const uniqueProductsMap = new Map();
for (const p of products) {
  if (!uniqueProductsMap.has(p.name)) {
    uniqueProductsMap.set(p.name, p);
  } else {
    if (!uniqueProductsMap.get(p.name).image_url && p.image_url) {
      uniqueProductsMap.set(p.name, p);
    }
  }
}

const uniqueProducts = Array.from(uniqueProductsMap.values());
uniqueProducts.forEach((p, index) => {
  p.id = (index + 1).toString();
});

fs.writeFileSync(outPath, JSON.stringify(uniqueProducts, null, 2));
console.log(`Imported ${uniqueProducts.length} products successfully!`);
