import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import brandLogo from "@/assets/brand-logo.png";
import { AllergensDialog } from "./AllergensDialog";

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
  branchImage,
}: MenuHeaderProps) => {
  const { language, setLanguage, t } = useLanguage();

  const displayBrandName =
    language === "ar" && brandNameAr ? brandNameAr : brandName;

  const displayBranchName =
    language === "ar" && branchNameAr ? branchNameAr : branchName;

  return (
    // Height Calculation:
    // Mobile: py-3(12px) + Text(~52px) + py-3(12px) + border(1px) = ~77px
    // Desktop: py-3(12px) + Text(~56px) + py-3(12px) + border(1px) = ~81px
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm transition-all duration-200">
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src={branchImage || brandLogo}
              alt={displayBranchName || "Logo"}
              className="h-10 w-auto max-w-[100px] object-contain rounded-md"
            />

            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground leading-none">
                {displayBrandName || t("Menu", "القائمة")}
              </h1>

              {displayBranchName && (
                <p className="text-sm sm:text-base font-medium text-muted-foreground leading-none mt-1">
                  {displayBranchName}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AllergensDialog variant="header" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="gap-2 text-foreground hover:bg-accent"
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
