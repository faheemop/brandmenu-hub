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
  sortOrder: number;
}

export const CategoryNav = ({
  selectedCategory,
  onCategoryChange,
  brandSlug,
  branchId,
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

      const { data, error } = await supabase.functions.invoke(
        `get-categories?${params.toString()}`,
        {
          method: "GET",
        }
      );

      if (error) throw error;
      return data.data || [];
    },
    enabled: !!brandSlug && !!branchId,
  });

  const getCategoryDisplayName = (category: Category) => {
    if (language === "ar") {
      return category.arabicName || category.name;
    }
    return category.name;
  };

  const orderedCategories =
    categories
      ?.filter((c: Category) => c.sortOrder > 0)
      .sort((a: Category, b: Category) => a.sortOrder - b.sortOrder) || [];

  const unorderedCategories =
    categories
      ?.filter((c: Category) => c.sortOrder === 0)
      .sort((a: Category, b: Category) => {
        const nameA = getCategoryDisplayName(a);
        const nameB = getCategoryDisplayName(b);
        return nameA.localeCompare(nameB, language === "ar" ? "ar" : "en");
      }) || [];

  const displayCategories = [...orderedCategories, ...unorderedCategories];

  return (
    // FIX: Updated top position to match MenuHeader height exactly on Mobile vs Desktop
    // Mobile Header ~77px | Desktop Header ~81px
    <div className="border-b border-border bg-card sticky top-[77px] md:top-[81px] z-40 shadow-sm transition-[top] duration-200">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex w-max space-x-2 py-3">
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs sm:text-sm">
                  {t("Loading categories...", "جاري تحميل الفئات...")}
                </span>
              </div>
            ) : (
              <>
                <Button
                  variant={selectedCategory === null ? "default" : "secondary"}
                  size="sm"
                  onClick={() => onCategoryChange(null)}
                  className="rounded-full px-4 h-8 text-xs sm:text-sm font-medium transition-colors"
                >
                  {t("All", "الكل")}
                </Button>
                {displayCategories.map((category: Category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "ghost"
                    }
                    size="sm"
                    onClick={() => onCategoryChange(category.id)}
                    className={`rounded-full px-4 h-8 text-xs sm:text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? ""
                        : "bg-muted/50 hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {getCategoryDisplayName(category)}
                  </Button>
                ))}
              </>
            )}
          </div>
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
};
