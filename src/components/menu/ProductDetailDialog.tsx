import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Flame } from "lucide-react"; // X hata diya kyunke wo use nahi ho raha tha

interface Product {
  id: number;
  title: string;
  arabicName?: string;
  description?: string;
  arabicDescription?: string;
  price: number;
  is_active: boolean;
  image1?: string | null;
  merchant_image?: string;
  modifiers?: any[];
  calories?: number;
  preparationTime?: number;
}

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductDetailDialog = ({
  product,
  open,
  onOpenChange,
}: ProductDetailDialogProps) => {
  const { language, t } = useLanguage();

  if (!product) return null;

  const displayName =
    language === "ar" && product.arabicName
      ? product.arabicName
      : product.title;

  const displayDescription =
    language === "ar" && product.arabicDescription
      ? product.arabicDescription
      : product.description;

  const displayImage = product.merchant_image || product.image1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] sm:max-w-md p-0 overflow-hidden rounded-2xl gap-0"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        {/* Hidden title for accessibility */}
        <DialogTitle className="sr-only">{displayName}</DialogTitle>

        {/* Image Section */}
        {displayImage && (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            <img
              src={displayImage}
              alt={displayName}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

            {/* CHANGE: Pehle ye 'right-3' tha, ab 'left-3' kar diya hai.
               Is se ye Close button (jo right side par hota hai) ke neechay nahi aayega.
            */}
            <div className="absolute top-3 left-3">
              {product.is_active ? (
                <Badge className="bg-green-500 text-white border-0 text-xs shadow-md">
                  {t("Available", "متوفر")}
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-xs shadow-md">
                  {t("Unavailable", "غير متوفر")}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Content Section */}
        <ScrollArea className="max-h-[50vh] sm:max-h-[60vh]">
          <div className="p-4 sm:p-5">
            {/* Title and Price Row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground leading-tight flex-1">
                {displayName}
              </h2>
              <div className="text-right shrink-0">
                <span className="text-xl sm:text-2xl font-bold text-primary">
                  {product.price?.toFixed(2)}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground block">
                  {t("SAR", "ر.س")}
                </span>
              </div>
            </div>

            {/* Meta info */}
            {(product.calories || product.preparationTime) && (
              <div className="flex items-center gap-3 mb-3">
                {product.calories && (
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                    <Flame className="w-3.5 h-3.5" />
                    <span>
                      {product.calories} {t("Cal", "سعرة")}
                    </span>
                  </div>
                )}
                {product.preparationTime && (
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {product.preparationTime} {t("min", "دقيقة")}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {displayDescription && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {displayDescription}
              </p>
            )}

            {/* Modifiers/Customizations */}
            {product.modifiers && product.modifiers.length > 0 && (
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-foreground text-sm mb-3">
                  {t("Customizations", "التخصيصات")}
                </h4>
                <div className="space-y-3">
                  {product.modifiers.map((modifier: any, index: number) => (
                    <div key={index} className="bg-muted/50 rounded-xl p-3">
                      <p className="font-medium text-sm text-foreground mb-2">
                        {language === "ar" && modifier.arabicName
                          ? modifier.arabicName
                          : modifier.name}
                      </p>
                      {modifier.options && modifier.options.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {modifier.options.map(
                            (opt: any, optIndex: number) => (
                              <Badge
                                key={optIndex}
                                variant="outline"
                                className="text-xs font-normal"
                              >
                                {language === "ar" && opt.arabicName
                                  ? opt.arabicName
                                  : opt.name}
                                {opt.price > 0 && (
                                  <span className="text-primary ms-1">
                                    +{opt.price}
                                  </span>
                                )}
                              </Badge>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
