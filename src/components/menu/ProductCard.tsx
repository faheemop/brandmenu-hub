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
  is_active: boolean; // Backend key
  image1?: string | null;
  merchant_image?: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { language, t } = useLanguage();

  const displayName =
    language === "ar" && product.arabicName
      ? product.arabicName
      : product.title;

  // Jo bhi backend se aa raha hai wahi dikhayenge
  const displayDescription =
    language === "ar" && product.arabicDescription
      ? product.arabicDescription
      : product.description;

  const displayImage = product.merchant_image || product.image1;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-menu-card border-border/50">
      <div className="aspect-square overflow-hidden bg-muted">
        {displayImage ? (
          <img
            src={displayImage}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <span className="text-4xl font-bold text-primary/20">
              {displayName?.[0] || "P"}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-lg text-foreground line-clamp-2">
            {displayName}
          </h3>
          {/* Active Badge */}
          {product.is_active && (
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] h-5 hover:text-white">
              {t("Active", "نشط")}
            </Badge>
          )}
        </div>

        {/* Description: Jo backend se aa raha hai wahi show hoga */}
        {displayDescription !== undefined && displayDescription !== null && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {displayDescription}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-primary">
            {product.price?.toFixed(2)}{" "}
            <span className="text-sm">{t("SAR", "ر.س")}</span>
          </span>

          {/* Agar inactive hai toh yahan bhi dikha sakte hain */}
          {!product.is_active && (
            <span className="text-xs text-destructive font-medium">
              {t("Unavailable", "غير متوفر")}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
