import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Store, ArrowRight } from "lucide-react";

const Index = () => {
  // Sample brand reference for testing
  const sampleBrandReference = "CODE231025109";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 flex items-center justify-center">
      <div className="container mx-auto px-4 py-12 max-w-xl text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Store className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Multi-Brand Menu
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Select your brand to view available branches and their menus.
        </p>

        <Link to={`/menu/${sampleBrandReference}`}>
          <Button size="lg" className="gap-2">
            View Demo Brand
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>

        <div className="mt-12 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Access any brand via URL:</p>
          <code className="text-sm bg-background px-3 py-2 rounded block">
            /menu/YOUR_BRAND_REFERENCE
          </code>
        </div>
      </div>
    </div>
  );
};

export default Index;
