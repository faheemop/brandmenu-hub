import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBrandBySlug, getBrandBranch } from "@/config/brands";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductGrid } from "@/components/menu/ProductGrid";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  image?: string;
  modifiers?: any[];
}

const MenuPage = () => {
  const { brandSlug, branchId } = useParams<{ brandSlug: string; branchId: string }>();
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  const brand = brandSlug ? getBrandBySlug(brandSlug) : undefined;
  const branch = brand && branchId ? getBrandBranch(brandSlug, parseInt(branchId)) : undefined;

  // Apply brand theme
  useEffect(() => {
    if (brand) {
      document.documentElement.style.setProperty("--brand-primary", brand.theme.primary);
      document.documentElement.style.setProperty("--brand-secondary", brand.theme.secondary);
      document.documentElement.style.setProperty("--brand-accent", brand.theme.accent);
    }
  }, [brand]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", brand?.apiReference, selectedCategory],
    queryFn: async () => {
      if (!brand) return null;
      
      // Show all products when no category is selected
      let apiUrl = `http://51.112.221.81:8000/api/products/getAllProducts?pageNo=1&pageSize=1000&brandReference=${brand.apiReference}`;
      
      // When category is selected, add filters with hard-coded branchId
      if (selectedCategory !== null) {
        apiUrl += `&categoryId=${selectedCategory}&includeModifiers=true&branchId=30`;
      }
      
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch products");
      
      const result = await response.json();
      return result.data || [];
    },
    enabled: !!brand,
  });

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-menu-bg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t("Brand Not Found", "العلامة التجارية غير موجودة")}
          </h1>
          <p className="text-muted-foreground">
            {t("Please check your URL and try again", "يرجى التحقق من الرابط والمحاولة مرة أخرى")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-menu-bg">
      <MenuHeader brand={brand} branch={branch} />
      
      <CategoryNav
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-destructive">
              {t("Failed to load products", "فشل تحميل المنتجات")}
            </p>
          </div>
        )}

        {data && <ProductGrid products={data} />}
      </main>
    </div>
  );
};

export default MenuPage;
