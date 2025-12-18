import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import brandLogo from "@/assets/brand-logo.png";

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
    <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* UPDATED IMAGE TAG: 
                - w-10 hata kar w-auto kar diya (taake image stretch na ho)
                - object-cover hata kar object-contain kar diya (taake image kategi nahi)
                - max-w-[100px] add kiya taake agar image bohot chori ho to header kharab na ho
            */}
            <img
              src={branchImage || brandLogo}
              alt={displayBranchName || "Logo"}
              className="h-10 w-auto max-w-[100px] object-contain rounded-md"
            />

            <div>
              <h1 className="text-xl font-bold text-foreground leading-none">
                {displayBrandName || t("Menu", "القائمة")}
              </h1>

              {displayBranchName && (
                <p className="text-xl font-bold text-foreground leading-none">
                  {displayBranchName}
                </p>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
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
