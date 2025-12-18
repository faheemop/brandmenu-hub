import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductGrid } from "@/components/menu/ProductGrid";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { ProductDetailDialog } from "@/components/menu/ProductDetailDialog";
import { Loader2, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { generateSlug } from "@/components/menu/BranchCard";

// CHANGE: Base URL constant add kiya gaya hai
const API_BASE_URL = "https://api-order.wags.sa";

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
  calories?: number;
  preparationTime?: number;
}

interface Branch {
  id: number;
  name: string;
  arabicName: string | null;
  image: string | null;
}

const MenuPage = () => {
  const { brandSlug, branchSlug } = useParams<{
    brandSlug: string;
    branchSlug: string;
  }>();
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Validate params
  const isValidParams = Boolean(
    brandSlug &&
      branchSlug &&
      !brandSlug.includes(":") &&
      !branchSlug.includes(":")
  );

  // Fetch branch data to find branch ID from slug
  const { data: branchData, isLoading: branchLoading } = useQuery({
    queryKey: ["branches", brandSlug],
    queryFn: async () => {
      const params = new URLSearchParams({
        brandReference: brandSlug!,
      });

      const { data, error } = await supabase.functions.invoke(
        `get-branches?${params.toString()}`,
        {
          method: "GET",
        }
      );

      if (error) throw error;
      return data;
    },
    enabled: isValidParams,
  });

  // Find the current branch by matching slug
  const currentBranch = branchData?.data?.find((b: Branch) => {
    const slug = generateSlug(b.name, b.id);
    return slug === branchSlug;
  });

  const branchId = currentBranch?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", brandSlug, branchId, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams({
        brandReference: brandSlug!,
        pageNo: "1",
        pageSize: "1000",
        branchId: branchId!.toString(),
      });

      if (selectedCategory !== null) {
        params.append("categoryId", selectedCategory.toString());
        params.append("includeModifiers", "true");
      }

      const { data, error } = await supabase.functions.invoke(
        `get-products?${params.toString()}`,
        {
          method: "GET",
        }
      );

      if (error) throw error;
      return data.data || [];
    },
    enabled: isValidParams && !!branchId,
  });

  // CHANGE: Helper function to fix image URL
  const getFullImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}/${imagePath.replace(/^\/+/, "")}`;
  };

  if (!isValidParams) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center px-4">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            {t("Invalid URL", "رابط غير صالح")}
          </h1>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">
            {t(
              "Please use a valid brand and branch URL",
              "يرجى استخدام رابط صالح للعلامة التجارية والفرع"
            )}
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

  if (branchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentBranch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center px-4">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            {t("Branch Not Found", "الفرع غير موجود")}
          </h1>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">
            {t(
              "The branch you're looking for doesn't exist",
              "الفرع الذي تبحث عنه غير موجود"
            )}
          </p>
          <Link to={`/menu/${brandSlug}`}>
            <Button className="gap-2">
              {t("View All Branches", "عرض جميع الفروع")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-muted/30"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <MenuHeader
        branchName={currentBranch?.name}
        branchNameAr={currentBranch?.arabicName}
        // CHANGE: Yahan getFullImageUrl function use kiya gaya hai
        branchImage={getFullImageUrl(currentBranch?.image)}
      />

      <CategoryNav
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        brandSlug={brandSlug!}
        branchId={branchId!}
      />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-destructive text-sm sm:text-base">
              {t("Failed to load products", "فشل تحميل المنتجات")}
            </p>
          </div>
        )}

        {data && (
          <ProductGrid products={data} onProductClick={setSelectedProduct} />
        )}
      </main>

      <ProductDetailDialog
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />
    </div>
  );
};

export default MenuPage;
