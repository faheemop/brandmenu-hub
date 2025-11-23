import { Link } from "react-router-dom";
import { brands } from "@/config/brands";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Store } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Multi-Brand Menu Platform
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate QR-friendly URLs for your brand menus. Each brand gets its own customized experience.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {brands.map((brand) => (
            <Card key={brand.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" />
                  {brand.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Branches:</p>
                    <div className="space-y-2">
                      {brand.branches.map((branch) => (
                        <Link
                          key={branch.id}
                          to={`/menu/${brand.slug}/${branch.id}`}
                          className="block"
                        >
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary"
                          >
                            <QrCode className="w-4 h-4" />
                            {branch.name}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Example URL:</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded block overflow-x-auto">
                      /menu/{brand.slug}/{brand.branches[0].id}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Configure Your Brands</h3>
                <p className="text-sm text-muted-foreground">
                  Edit <code className="bg-muted px-1 py-0.5 rounded text-xs">src/config/brands.ts</code> to add your brands, themes, and branch information.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Generate QR Codes</h3>
                <p className="text-sm text-muted-foreground">
                  Use the URLs shown above to create QR codes for each branch. Customers scan and instantly see your branded menu.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Dynamic Theming</h3>
                <p className="text-sm text-muted-foreground">
                  Each brand automatically applies its own colors and logo. Support for both Arabic and English included.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
