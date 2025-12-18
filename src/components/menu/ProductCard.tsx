import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
}

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { language, t } = useLanguage();

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
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border/50 cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden bg-muted">
        {displayImage ? (
          <img
            src={displayImage}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <span className="text-3xl sm:text-4xl font-bold text-primary/20">
              {displayName?.[0] || "P"}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-3 sm:p-4">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-semibold text-sm sm:text-base md:text-lg text-foreground line-clamp-2 flex-1">
            {displayName}
          </h3>
          {!product.is_active && (
            <Badge variant="destructive" className="text-[10px] h-5 shrink-0">
              {t("Unavailable", "غير متوفر")}
            </Badge>
          )}
        </div>

        {displayDescription && (
          <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
            {displayDescription}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <span className="text-base sm:text-lg md:text-xl font-bold text-primary">
            {product.price?.toFixed(2)}
            <span className="text-xs sm:text-sm ms-1">{t("SAR", "ر.س")}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
