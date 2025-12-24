import { ProductCard } from "./ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";

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
  onProductClick?: (product: Product) => void;
}

export const ProductGrid = ({ products, onProductClick }: ProductGridProps) => {
  const { t } = useLanguage();

  // Filter out inactive/unavailable products
  const activeProducts = products?.filter(product => product.is_active) || [];

  if (activeProducts.length === 0) {
    return (
      <div className="text-center py-16 sm:py-20">
        <p className="text-muted-foreground text-sm sm:text-base">
          {t("No products available", "لا توجد منتجات متاحة")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
      {activeProducts.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onClick={() => onProductClick?.(product)}
        />
      ))}
    </div>
  );
};
