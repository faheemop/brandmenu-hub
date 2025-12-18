import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

interface MenuHeaderProps {
  brandName?: string;
  brandNameAr?: string;
  branchName?: string;
  branchNameAr?: string;
  branchImage?: string | null;
}

export const MenuHeader = ({ 
  brandName, 
  brandNameAr, 
  branchName, 
  branchNameAr,
  branchImage 
}: MenuHeaderProps) => {
  const { language, setLanguage } = useLanguage();

  const displayBrandName = language === "ar" && brandNameAr ? brandNameAr : brandName;
  const displayBranchName = language === "ar" && branchNameAr ? branchNameAr : branchName;

  return (
    <header className="sticky top-0 z-50">
      {/* Branch Hero Image */}
      {branchImage && (
        <div className="relative w-full h-32 sm:h-40 md:h-48 overflow-hidden">
          <img 
            src={branchImage} 
            alt={displayBranchName || "Branch"} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
          
          {/* Branch name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <div className="container mx-auto max-w-7xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground drop-shadow-sm">
                {displayBranchName || displayBrandName || "Menu"}
              </h1>
              {displayBranchName && displayBrandName && (
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  {displayBrandName}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Compact header without image */}
      {!branchImage && (
        <div className="bg-primary text-primary-foreground py-4 sm:py-6">
          <div className="container mx-auto px-4 max-w-7xl">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">
              {displayBranchName || displayBrandName || "Menu"}
            </h1>
            {displayBranchName && displayBrandName && (
              <p className="text-sm text-primary-foreground/80 text-center mt-1">
                {displayBrandName}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Language toggle bar */}
      <div className="bg-card border-b border-border backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-2 sm:py-3 max-w-7xl">
          <div className="flex items-center justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="gap-2 text-xs sm:text-sm"
            >
              <Languages className="w-4 h-4" />
              {language === "en" ? "العربية" : "English"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
