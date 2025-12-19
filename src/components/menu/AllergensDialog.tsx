import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AllergensDialogProps {
  variant?: "header" | "product";
}

export const AllergensDialog = ({
  variant = "header",
}: AllergensDialogProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  // FIX: Header variant now uses 'bg-muted' instead of 'bg-background' to be visible on desktop white header
  const triggerClass =
    variant === "header"
      ? "rounded-full bg-muted hover:bg-muted/80 text-foreground px-3 h-8 gap-1.5 flex items-center transition-colors border border-transparent"
      : "rounded-full bg-black/40 hover:bg-black/60 text-white border-none backdrop-blur-sm px-3 h-8 gap-1.5 flex items-center transition-colors shadow-sm";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={triggerClass}>
          <Info className={`w-4 h-4 ${isRTL ? "ml-1" : "mr-1"}`} />
          <span className="text-xs font-medium">
            {t("Allergens", "الحساسية")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-none shadow-none flex items-center justify-center">
        <div className="relative w-full max-w-[90vw] bg-white rounded-lg p-2 overflow-hidden shadow-xl">
          <img
            src="/license.png"
            alt="Allergens Info"
            className="w-full h-auto object-contain rounded"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
