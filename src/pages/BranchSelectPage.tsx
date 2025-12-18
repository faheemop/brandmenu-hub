import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BranchCard, generateSlug } from "@/components/menu/BranchCard";
import { Button } from "@/components/ui/button";

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

const BRANCHES_PER_PAGE = 6;

const BranchSelectPage = () => {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: branchData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["branches", brandSlug],
    queryFn: async () => {
      if (!brandSlug) return null;

      const params = new URLSearchParams({
        brandReference: brandSlug,
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
    enabled: !!brandSlug,
  });

  const handleBranchSelect = (branch: Branch) => {
    const branchSlug = generateSlug(branch.name, branch.id);
    navigate(`/menu/${brandSlug}/${branchSlug}`);
  };

  // CHANGE: Filter hata diya gaya hai taake sari branches show hon
  const activeBranches = branchData?.data || [];

  const totalPages = Math.ceil(activeBranches.length / BRANCHES_PER_PAGE);
  const startIndex = (currentPage - 1) * BRANCHES_PER_PAGE;
  const paginatedBranches = activeBranches.slice(
    startIndex,
    startIndex + BRANCHES_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !branchData) {
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

  return (
    <div
      className="min-h-screen bg-muted/30"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6 sm:py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
            {t("Our Branches", "فروعنا")}
          </h1>
          <p className="text-primary-foreground/80 text-xs sm:text-sm">
            {t("Select a branch to view the menu", "اختر فرعاً لعرض القائمة")}
          </p>
        </div>
      </div>

      {/* Branch Grid */}
      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {paginatedBranches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              brandSlug={brandSlug!}
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
};

export default BranchSelectPage;
