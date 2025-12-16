import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductGrid } from "@/components/menu/ProductGrid";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { Loader2, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  title: string;
  arabicName?: string;
  description?: string;
  arabicDescription?: string;
  price: number;
  image1?: string;
  merchant_image?: string;
  modifiers?: any[];
}

interface Branch {
  id: number;
  name: string;
  arabicName: string | null;
}

const MenuPage = () => {
  const { brandSlug, branchId } = useParams<{ brandSlug: string; branchId: string }>();
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Validate params BEFORE hooks to prevent invalid API calls
  const isValidParams = Boolean(
    brandSlug && 
    branchId && 
    !brandSlug.includes(':') && 
    !branchId.includes(':') &&
    !isNaN(parseInt(branchId))
  );

  // Fetch branch data
  const { data: branchData } = useQuery({
    queryKey: ["branches", brandSlug],
    queryFn: async () => {
      const params = new URLSearchParams({
        brandReference: brandSlug!,
      });
      
      const { data, error } = await supabase.functions.invoke(`get-branches?${params.toString()}`, {
        method: 'GET',
      });

      if (error) throw error;
      return data;
    },
    enabled: isValidParams,
  });

  const currentBranch = branchData?.data?.find((b: Branch) => b.id === parseInt(branchId || '0'));

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", brandSlug, branchId, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams({
        brandReference: brandSlug!,
        pageNo: '1',
        pageSize: '1000',
        branchId: branchId!,
      });
      
      if (selectedCategory !== null) {
        params.append('categoryId', selectedCategory.toString());
        params.append('includeModifiers', 'true');
      }
      
      const { data, error } = await supabase.functions.invoke(`get-products?${params.toString()}`, {
        method: 'GET',
      });

      if (error) throw error;
      return data.data || [];
    },
    enabled: isValidParams,
  });

  if (!isValidParams) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t("Invalid URL", "رابط غير صالح")}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t("Please use a valid brand and branch URL", "يرجى استخدام رابط صالح للعلامة التجارية والفرع")}
          </p>
          <Link to="/">
            <Button className="gap-2">
              <Home className="w-4 h-4" />
              {t("Go to Home", "اذهب للرئيسية")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <MenuHeader 
        branchName={currentBranch?.name}
        branchNameAr={currentBranch?.arabicName}
      />
      
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
