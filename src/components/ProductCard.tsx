import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="product-card group relative mb-[15px] border border-transparent hover:border-[var(--color-border)] p-2 transition-colors duration-200 h-full" id={`product-${product.id}`}>
      
      {/* Badges */}
      {product.is_new && (
        <span className="badge-label absolute top-2 right-2 z-10 text-[10px] opacity-90">NEW</span>
      )}
      {!product.in_stock && (
        <span className="badge-label absolute top-2 left-2 z-10 text-[10px] bg-black opacity-90">SOLD OUT</span>
      )}
      
      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="block mb-[20px] bg-[#fdfdfd] border border-[var(--color-border)] overflow-hidden">
        <div className="relative aspect-square flex items-center justify-center overflow-hidden p-4">
           {product.image_url ? (
             /* eslint-disable-next-line @next/next/no-img-element */
             <img 
               src={product.image_url} 
               alt={product.name}
               className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
             />
           ) : (
             <div className="opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500 ease-out flex flex-col items-center">
               <svg className="w-20 h-20 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
               </svg>
             </div>
           )}
        </div>
      </Link>

      {/* Info Container */}
      <div className="text-center px-2 flex flex-col flex-1">
        <div className="text-[12px] text-[var(--color-primary)] font-serif mb-1 italic opacity-80 capitalize">
          {product.category}
        </div>
        <Link href={`/products/${product.id}`} className="block flex-1 group-hover:underline">
          <h3 className="text-[14px] md:text-[15px] font-serif text-[var(--color-text-primary)] leading-tight mb-2 line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>
        </Link>
        <div className="price-text mt-auto pt-2">
          ${product.price.toFixed(2)}
        </div>
      </div>
      
      {/* Add to cart overlay (desktop) */}
      {product.in_stock && (
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-[var(--color-primary)] text-white py-2 text-sm font-display uppercase tracking-wider hover:bg-black transition-colors"
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
