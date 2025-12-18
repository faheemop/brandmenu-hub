import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CategoryNavProps {
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  brandSlug: string;
  branchId: number;
}

interface Category {
  id: number;
  name: string;
  arabicName: string | null;
}

export const CategoryNav = ({ 
  selectedCategory, 
  onCategoryChange, 
  brandSlug,
  branchId 
}: CategoryNavProps) => {
  const { language, t } = useLanguage();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories", brandSlug, branchId],
    queryFn: async () => {
      if (!brandSlug || !branchId) return [];
      
      const params = new URLSearchParams({
        brandReference: brandSlug,
        branchId: branchId.toString(),
      });
      
      const { data, error } = await supabase.functions.invoke(`get-categories?${params.toString()}`, {
        method: 'GET',
      });

      if (error) throw error;
      return data.data || [];
    },
    enabled: !!brandSlug && !!branchId,
  });

  // Get display name with Arabic fallback to English
  const getCategoryDisplayName = (category: Category) => {
    if (language === "ar") {
      return category.arabicName || category.name;
    }
    return category.name;
  };

  return (
    <div className="border-b border-border bg-card sticky top-[80px] sm:top-[88px] z-40">
      <ScrollArea className="w-full">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex gap-2 py-2 sm:py-3">
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs sm:text-sm">{t("Loading categories...", "جاري تحميل الفئات...")}</span>
              </div>
            ) : (
              <>
                <Button
                  variant={selectedCategory === null ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onCategoryChange(null)}
                  className="whitespace-nowrap text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4"
                >
                  {t("All", "الكل")}
                </Button>
                {categories?.map((category: Category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onCategoryChange(category.id)}
                    className="whitespace-nowrap text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4"
                  >
                    {getCategoryDisplayName(category)}
                  </Button>
                ))}
              </>
            )}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
