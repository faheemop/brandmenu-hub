import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  image?: string;
  modifiers?: any[];
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { language, t } = useLanguage();

  const displayName = language === "ar" && product.nameAr ? product.nameAr : product.name;
  const displayDescription =
    language === "ar" && product.descriptionAr ? product.descriptionAr : product.description;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-menu-card border-border/50">
      <div className="aspect-square overflow-hidden bg-muted">
        {product.image ? (
          <img
            src={product.image}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <span className="text-4xl font-bold text-primary/20">{displayName[0]}</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 text-foreground line-clamp-2">
          {displayName}
        </h3>

        {displayDescription && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {displayDescription}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {product.price.toFixed(2)}{" "}
            <span className="text-sm">{t("SAR", "ر.س")}</span>
          </span>

          {product.modifiers && product.modifiers.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {t("Customizable", "قابل للتخصيص")}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
