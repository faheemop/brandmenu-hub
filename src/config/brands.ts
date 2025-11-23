export interface BrandConfig {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  apiReference: string;
  logo: string;
  theme: {
    primary: string; // HSL format: "25 95% 53%"
    secondary: string;
    accent: string;
  };
  branches: {
    id: number;
    name: string;
    nameAr: string;
  }[];
}

// Brand configurations - add your brands here
export const brands: BrandConfig[] = [
  {
    id: "sample-cafe",
    slug: "sample-cafe",
    name: "Sample Café",
    nameAr: "مقهى نموذج",
    apiReference: "ST890761281",
    logo: "/brands/sample-cafe-logo.png",
    theme: {
      primary: "25 95% 53%", // Orange
      secondary: "20 14% 20%", // Dark brown
      accent: "38 92% 50%", // Golden
    },
    branches: [
      { id: 30, name: "Main Branch", nameAr: "الفرع الرئيسي" },
      { id: 31, name: "Downtown Branch", nameAr: "فرع وسط المدينة" },
    ],
  },
  // Add more brands as needed
];

export const getBrandBySlug = (slug: string): BrandConfig | undefined => {
  return brands.find((brand) => brand.slug === slug);
};

export const getBrandBranch = (brandSlug: string, branchId: number) => {
  const brand = getBrandBySlug(brandSlug);
  return brand?.branches.find((branch) => branch.id === branchId);
};
