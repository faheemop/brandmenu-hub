import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  // Default brand reference
  const defaultBrandReference = "CODE231025109";

  useEffect(() => {
    // Automatically redirect to the brand's branch selection page
    navigate(`/menu/${defaultBrandReference}`, { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
};

export default Index;
