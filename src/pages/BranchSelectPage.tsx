import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, MapPin, Clock, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !branchData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center px-4">
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
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8 px-4">
        <div className="container mx-auto max-w-xl text-center">
          <h1 className="text-2xl font-bold mb-2">
            {t("Our Branches", "فروعنا")}
          </h1>
          <p className="text-primary-foreground/80 text-sm">
            {t("Select a branch to view the menu", "اختر فرعاً لعرض القائمة")}
          </p>
        </div>
      </div>

      {/* Branch List */}
      <div className="container mx-auto px-4 py-6 max-w-xl">
        <div className="space-y-3">
          {activeBranches.map((branch) => {
            const displayName = language === "ar" && branch.arabicName ? branch.arabicName : branch.name;
            const displayAddress = language === "ar" && branch.arabicAddress ? branch.arabicAddress : branch.address;
            
            return (
              <button
                key={branch.id}
                onClick={() => handleBranchSelect(branch.id)}
                className="w-full bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-border/50 text-left rtl:text-right flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {displayName}
                  </h3>
                  <p className="text-muted-foreground text-sm truncate">
                    {displayAddress}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {branch.is24Hours 
                        ? t("24 Hours", "٢٤ ساعة")
                        : `${branch.opening_time} - ${branch.closing_time}`
                      }
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground rtl:rotate-180" />
              </button>
            );
          })}

          {activeBranches.length === 0 && (
            <div className="text-center py-16">
              <MapPin className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {t("No branches available", "لا توجد فروع متاحة")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchSelectPage;
