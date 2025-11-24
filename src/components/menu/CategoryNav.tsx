import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getBrandBySlug } from "@/config/brands";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CategoryNavProps {
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

interface Category {
  id: number;
  name: string;
  arabicName: string;
}

export const CategoryNav = ({ selectedCategory, onCategoryChange }: CategoryNavProps) => {
  const { language, t } = useLanguage();
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const brand = brandSlug ? getBrandBySlug(brandSlug) : undefined;

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories", brand?.apiReference],
    queryFn: async () => {
      if (!brand) return [];
      
      const params = new URLSearchParams({
        brandReference: brand.apiReference,
      });
      
      const { data, error } = await supabase.functions.invoke(`get-categories?${params.toString()}`, {
        method: 'GET',
      });

      if (error) throw error;
      return data.data || [];
    },
    enabled: !!brand,
  });

  return (
    <div className="border-b border-border bg-menu-category sticky top-[73px] z-40">
      <ScrollArea className="w-full">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex gap-2 py-3">
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">{t("Loading categories...", "جاري تحميل الفئات...")}</span>
              </div>
            ) : (
              <>
                <Button
                  variant={selectedCategory === null ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onCategoryChange(null)}
                  className="whitespace-nowrap"
                >
                  {t("All Products", "جميع المنتجات")}
                </Button>
                {categories?.map((category: Category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onCategoryChange(category.id)}
                    className="whitespace-nowrap"
                  >
                    {language === "ar" ? category.arabicName : category.name}
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
