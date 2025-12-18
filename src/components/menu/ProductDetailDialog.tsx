import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {displayImage && (
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img
              src={displayImage}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6">
            <DialogHeader>
              <div className="flex items-start justify-between gap-2">
                <DialogTitle className="text-xl font-bold text-foreground">
                  {displayName}
                </DialogTitle>
                {product.is_active ? (
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs shrink-0">
                    {t("Available", "متوفر")}
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs shrink-0">
                    {t("Unavailable", "غير متوفر")}
                  </Badge>
                )}
              </div>
            </DialogHeader>

            {displayDescription && (
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {displayDescription}
              </p>
            )}

            <div className="mt-4 flex items-center gap-4">
              <span className="text-2xl font-bold text-primary">
                {product.price?.toFixed(2)}{" "}
                <span className="text-sm font-normal">{t("SAR", "ر.س")}</span>
              </span>

              {product.calories && (
                <span className="text-sm text-muted-foreground">
                  {product.calories} {t("Cal", "سعرة")}
                </span>
              )}

              {product.preparationTime && (
                <span className="text-sm text-muted-foreground">
                  {product.preparationTime} {t("min", "دقيقة")}
                </span>
              )}
            </div>

            {product.modifiers && product.modifiers.length > 0 && (
              <div className="mt-6 border-t border-border pt-4">
                <h4 className="font-semibold text-foreground mb-3">
                  {t("Customizations", "التخصيصات")}
                </h4>
                <div className="space-y-3">
                  {product.modifiers.map((modifier: any, index: number) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-3">
                      <p className="font-medium text-sm">
                        {language === "ar" && modifier.arabicName
                          ? modifier.arabicName
                          : modifier.name}
                      </p>
                      {modifier.options && modifier.options.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {modifier.options.map((opt: any, optIndex: number) => (
                            <Badge
                              key={optIndex}
                              variant="outline"
                              className="text-xs"
                            >
                              {language === "ar" && opt.arabicName
                                ? opt.arabicName
                                : opt.name}
                              {opt.price > 0 && ` (+${opt.price})`}
                            </Badge>
                          ))}
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
