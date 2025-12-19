import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";

interface Branch {
  id: number;
  name: string;
  arabicName: string | null;
  address: string;
  arabicAddress: string | null;
  opening_time: string;
  closing_time: string;
  is24Hours: boolean;
  active: boolean;
  image: string | null;
}

interface BranchCardProps {
  branch: Branch;
  brandSlug: string;
  onClick: () => void;
}

const generateSlug = (name: string, id: number): string => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return slug || `branch-${id}`;
};

export const BranchCard = ({ branch, brandSlug, onClick }: BranchCardProps) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const displayName =
    language === "ar" && branch.arabicName ? branch.arabicName : branch.name;
  const displayAddress =
    language === "ar" && branch.arabicAddress
      ? branch.arabicAddress
      : branch.address;

  const branchSlug = generateSlug(branch.name, branch.id);
  const menuUrl = `${window.location.origin}/menu/${branchSlug}`;

  const handleClick = () => {
    navigate(`/menu/${branchSlug}`);
    onClick();
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-card border-border/50"
      onClick={handleClick}
    >
      <CardContent className="p-5">
        <div className="flex flex-col items-center text-center">
          {/* QR Code */}
          <div className="bg-white p-3 rounded-xl shadow-sm mb-4">
            <QRCodeSVG
              value={menuUrl}
              size={120}
              level="M"
              includeMargin={false}
            />
          </div>

          {/* Branch Info */}
          <div className="w-full">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <h3 className="font-semibold text-foreground truncate">
                {displayName}
              </h3>
            </div>

            <p className="text-muted-foreground text-sm truncate mb-2">
              {displayAddress}
            </p>

            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>
                {branch.is24Hours
                  ? t("24 Hours", "٢٤ ساعة")
                  : `${branch.opening_time} - ${branch.closing_time}`}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { generateSlug };
