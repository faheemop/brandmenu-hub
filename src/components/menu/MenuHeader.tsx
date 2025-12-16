import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import brandLogo from "@/assets/brand-logo.png";

interface MenuHeaderProps {
  brandName?: string;
  brandNameAr?: string;
  branchName?: string;
  branchNameAr?: string;
}

export const MenuHeader = ({ brandName, brandNameAr, branchName, branchNameAr }: MenuHeaderProps) => {
  const { language, setLanguage } = useLanguage();

  const displayBrandName = language === "ar" && brandNameAr ? brandNameAr : brandName;
  const displayBranchName = language === "ar" && branchNameAr ? branchNameAr : branchName;

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={brandLogo} 
              alt={displayBrandName || "Brand Logo"} 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {displayBrandName || "Menu"}
              </h1>
              {displayBranchName && (
                <p className="text-sm text-muted-foreground">
                  {displayBranchName}
                </p>
              )}
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
