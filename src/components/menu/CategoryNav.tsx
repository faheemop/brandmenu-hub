import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CategoryNavProps {
  selectedCategory: number;
  onCategoryChange: (categoryId: number) => void;
}

// Mock categories - replace with API call if categories are dynamic
const categories = [
  { id: 1, name: "Hot Drinks", nameAr: "المشروبات الساخنة" },
  { id: 2, name: "Cold Drinks", nameAr: "المشروبات الباردة" },
  { id: 3, name: "Food", nameAr: "الطعام" },
  { id: 4, name: "Desserts", nameAr: "الحلويات" },
];

export const CategoryNav = ({ selectedCategory, onCategoryChange }: CategoryNavProps) => {
  const { language } = useLanguage();

  return (
    <div className="border-b border-border bg-menu-category sticky top-[73px] z-40">
      <ScrollArea className="w-full">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex gap-2 py-3">
            {categories.map((category) => (
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
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
