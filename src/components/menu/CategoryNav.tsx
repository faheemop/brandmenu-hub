import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getBrandBySlug } from "@/config/brands";
import { Loader2 } from "lucide-react";

interface CategoryNavProps {
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

interface Category {
  id: number;
  name: string;
  nameAr: string;
}

export const CategoryNav = ({ selectedCategory, onCategoryChange }: CategoryNavProps) => {
  const { language, t } = useLanguage();
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const brand = brandSlug ? getBrandBySlug(brandSlug) : undefined;

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories", brand?.apiReference],
    queryFn: async () => {
      if (!brand) return [];
      
      const apiUrl = `http://51.112.221.81:8000/api/category/getCategoryList?brandReference=${brand.apiReference}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch categories");
      
      const result = await response.json();
      return result.data || [];
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
                    {language === "ar" ? category.nameAr : category.name}
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
