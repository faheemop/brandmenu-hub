import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, MapPin, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

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

interface BranchResponse {
  isError: boolean;
  message: string;
  data: Branch[];
}

const BranchSelectPage = () => {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const { data: branchData, isLoading, error } = useQuery({
    queryKey: ["branches", brandSlug],
    queryFn: async () => {
      if (!brandSlug) return null;
      
      const params = new URLSearchParams({
        brandReference: brandSlug,
      });
      
      const { data, error } = await supabase.functions.invoke(`get-branches?${params.toString()}`, {
        method: 'GET',
      });

      if (error) throw error;
      return data as BranchResponse;
    },
    enabled: !!brandSlug,
  });

  const handleBranchSelect = (branchId: number) => {
    navigate(`/menu/${brandSlug}/${branchId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !branchData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t("Error Loading Branches", "خطأ في تحميل الفروع")}
          </h1>
          <p className="text-muted-foreground">
            {t("Please try again later", "يرجى المحاولة مرة أخرى لاحقاً")}
          </p>
        </div>
      </div>
    );
  }

  const activeBranches = branchData.data?.filter(branch => branch.active) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("Select Branch", "اختر الفرع")}
          </h1>
          <p className="text-muted-foreground">
            {t("Choose a branch to view the menu", "اختر فرعاً لعرض القائمة")}
          </p>
        </div>

        <div className="space-y-4">
          {activeBranches.map((branch) => {
            const displayName = language === "ar" && branch.arabicName ? branch.arabicName : branch.name;
            const displayAddress = language === "ar" && branch.arabicAddress ? branch.arabicAddress : branch.address;
            
            return (
              <Card 
                key={branch.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
                onClick={() => handleBranchSelect(branch.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {displayName}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{displayAddress}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Clock className="w-4 h-4" />
                        <span>
                          {branch.is24Hours 
                            ? t("Open 24 Hours", "مفتوح 24 ساعة")
                            : `${branch.opening_time} - ${branch.closing_time}`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {activeBranches.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                {t("No active branches available", "لا توجد فروع متاحة")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchSelectPage;
