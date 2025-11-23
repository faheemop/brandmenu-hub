import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import type { BrandConfig } from "@/config/brands";

interface MenuHeaderProps {
  brand: BrandConfig;
  branch: { name: string; nameAr: string };
}

export const MenuHeader = ({ brand, branch }: MenuHeaderProps) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {brand.name[0]}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {language === "ar" ? brand.nameAr : brand.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {language === "ar" ? branch.nameAr : branch.name}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="gap-2"
          >
            <Languages className="w-4 h-4" />
            {language === "en" ? "العربية" : "English"}
          </Button>
        </div>
      </div>
    </header>
  );
};
