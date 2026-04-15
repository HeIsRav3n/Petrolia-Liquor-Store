import { NextRequest, NextResponse } from 'next/server';
import { getFilteredProducts, addProduct } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const limitParam = searchParams.get('limit');
  const inStockParam = searchParams.get('in_stock');
  const filters = {
    category: searchParams.get('category') || undefined,
    subcategory: searchParams.get('subcategory') || undefined,
    country: searchParams.get('country') || undefined,
    size: searchParams.get('size') || undefined,
    type: searchParams.get('type') || undefined,
    search: searchParams.get('search') || undefined,
    featured: searchParams.get('featured') === 'true' ? true : undefined,
    is_new: searchParams.get('is_new') === 'true' ? true : undefined,
    is_miscellaneous: searchParams.get('is_miscellaneous') === 'true' ? true : undefined,
    in_stock: inStockParam === 'true' ? true : inStockParam === 'false' ? false : undefined,
    sort: searchParams.get('sort') || undefined,
    limit: limitParam ? parseInt(limitParam, 10) : undefined,
  };

  const products = getFilteredProducts(filters);
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = addProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}
