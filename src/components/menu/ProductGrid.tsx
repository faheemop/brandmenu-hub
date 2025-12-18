import { ProductCard } from "./ProductCard";

interface Product {
  id: number;
  title: string;
  arabicName?: string;
  description?: string;
  arabicDescription?: string;
  price: number;
  is_active: boolean;
  image1?: string | null;
  merchant_image?: string;
  modifiers?: any[];
}

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">No products available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
