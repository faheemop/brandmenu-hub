import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductGrid } from "@/components/menu/ProductGrid";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { ProductDetailDialog } from "@/components/menu/ProductDetailDialog";
import {
  Loader2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BranchCard, generateSlug } from "@/components/menu/BranchCard";
import { AllergensDialog } from "@/components/menu/AllergensDialog";

const API_BASE_URL = "https://api-order.wags.sa";
const DEFAULT_BRAND_REFERENCE = "CODE231025109";
const BRANCHES_PER_PAGE = 6;

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
  address: string;
  arabicAddress: string | null;
  opening_time: string;
  closing_time: string;
  is24Hours: boolean;
  active: boolean;
  image: string | null;
}

interface BranchResponse {
  isError: boolean;
  message: string;
  data: Branch[];
}

const MenuPage = () => {
  const { language, t } = useLanguage();
  const { branchSlug } = useParams<{ branchSlug?: string }>();
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const brandReference = DEFAULT_BRAND_REFERENCE;

  // Fetch branches
  const {
    data: branchData,
    isLoading: branchLoading,
    error: branchError,
  } = useQuery({
    queryKey: ["branches", brandReference],
    queryFn: async () => {
      const params = new URLSearchParams({
        brandReference: brandReference,
      });

      const { data, error } = await supabase.functions.invoke(
        `get-branches?${params.toString()}`,
        {
          method: "GET",
        }
      );

      if (error) throw error;
      return data as BranchResponse;
    },
  });

  // Auto-select branch from URL
  useEffect(() => {
    if (branchSlug && branchData?.data && !selectedBranch) {
      const branch = branchData.data.find(
        (b) => generateSlug(b.name, b.id) === branchSlug
      );
      if (branch) {
        setSelectedBranch(branch);
      }
    }
  }, [branchSlug, branchData, selectedBranch]);

  // Fetch products when branch is selected
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: [
      "products",
      brandReference,
      selectedBranch?.id,
      selectedCategory,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        brandReference: brandReference,
        pageNo: "1",
        pageSize: "1000",
        branchId: selectedBranch!.id.toString(),
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
    enabled: !!selectedBranch,
  });

  const getFullImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}/${imagePath.replace(/^\/+/, "")}`;
  };

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    setSelectedCategory(null);
    const slug = generateSlug(branch.name, branch.id);
    navigate(`/menu/${slug}`);
  };

  const handleBackToBranches = () => {
    setSelectedBranch(null);
    setSelectedCategory(null);
    navigate("/menu");
  };

  // Branch list pagination
  const activeBranches =
    branchData?.data?.filter((branch) => branch.active) || [];
  const totalPages = Math.ceil(activeBranches.length / BRANCHES_PER_PAGE);
  const startIndex = (currentPage - 1) * BRANCHES_PER_PAGE;
  const paginatedBranches = activeBranches.slice(
    startIndex,
    startIndex + BRANCHES_PER_PAGE
  );

  // Loading state for branches
  if (branchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Error state for branches
  if (branchError || !branchData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t("Error Loading Branches", "خطأ في تحميل الفروع")}
          </h1>
          <p className="text-muted-foreground">
            {t("Please try again later", "يرجى المحاولة مرة أخرى لاحقاً")}
          </p>
        </div>
      </div>
    );
  }

  // Branch selection view
  if (!selectedBranch) {
    return (
      <div
        className="min-h-screen bg-muted/30"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        {/* Header - Added Flex and License Dialog */}
        <div className="bg-primary text-primary-foreground py-6 sm:py-8 px-4">
          <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-start flex-1">
              <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
                {t("Our Branches", "فروعنا")}
              </h1>
              <p className="text-primary-foreground/80 text-xs sm:text-sm">
                {t(
                  "Select a branch to view the menu",
                  "اختر فرعاً لعرض القائمة"
                )}
              </p>
            </div>

            {/* Added License Pill here */}
            <div className="flex-shrink-0">
              <AllergensDialog variant="header" />
            </div>
          </div>
        </div>

        {/* Branch Grid */}
        <div className="container mx-auto px-4 py-4 sm:py-6 max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {paginatedBranches.map((branch) => (
              <BranchCard
                key={branch.id}
                branch={branch}
                brandSlug={brandReference}
                onClick={() => handleBranchSelect(branch)}
              />
            ))}
          </div>

          {activeBranches.length === 0 && (
            <div className="text-center py-16">
              <MapPin className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {t("No branches available", "لا توجد فروع متاحة")}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t("Previous", "السابق")}
                </span>
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                <span className="hidden sm:inline">{t("Next", "التالي")}</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Check if this is the "BRGR Ramalina" branch (hide back button for this branch)
  const hideBranchNavigation = selectedBranch.name.toLowerCase().includes("brgr ramalina");

  // Menu view when branch is selected
  return (
    <div
      className="min-h-screen bg-muted/30"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Back button - hidden for BRGR Ramalina branch */}
      {!hideBranchNavigation && (
        <div className="bg-background border-b">
          <div className="container mx-auto px-4 py-2 max-w-7xl">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToBranches}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("Back to Branches", "العودة للفروع")}
            </Button>
          </div>
        </div>
      )}

      <MenuHeader
        branchName={selectedBranch.name}
        branchNameAr={selectedBranch.arabicName}
        branchImage={getFullImageUrl(selectedBranch.image)}
      />

      <CategoryNav
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        brandSlug={brandReference}
        branchId={selectedBranch.id}
      />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        {productsLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {productsError && (
          <div className="text-center py-20">
            <p className="text-destructive text-sm sm:text-base">
              {t("Failed to load products", "فشل تحميل المنتجات")}
            </p>
          </div>
        )}

        {productsData && (
          <ProductGrid
            products={productsData}
            onProductClick={setSelectedProduct}
          />
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
