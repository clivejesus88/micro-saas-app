export interface ScanData {
  id: string;
  name: string;
  category: string;
  retailPrice: number;
  savings: number;
  markup: string;
  timeAgo: string;
  isSaved: boolean;
  image: string;
  materialCost: number;
}

export const ALL_SCANS: ScanData[] = [
  {
    id: "1",
    name: "Air Jordan 1 Retro",
    category: "Sneakers",
    retailPrice: 180,
    savings: 112,
    markup: "165%",
    timeAgo: "2h ago",
    isSaved: true,
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=600&h=600",
    materialCost: 68,
  },
  {
    id: "2",
    name: "Gucci GG Canvas Tote",
    category: "Bags",
    retailPrice: 1200,
    savings: 1050,
    markup: "700%",
    timeAgo: "5h ago",
    isSaved: true,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600&h=600",
    materialCost: 150,
  },
  {
    id: "3",
    name: "Dyson Airwrap",
    category: "Electronics",
    retailPrice: 599,
    savings: 380,
    markup: "274%",
    timeAgo: "Yesterday",
    isSaved: false,
    image:
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=600&h=600",
    materialCost: 219,
  },
  {
    id: "4",
    name: "Levi's 501 Jeans",
    category: "Fashion",
    retailPrice: 89,
    savings: 61,
    markup: "218%",
    timeAgo: "2 days ago",
    isSaved: false,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=600&h=600",
    materialCost: 28,
  },
  {
    id: "5",
    name: "Le Creuset Dutch Oven",
    category: "Home",
    retailPrice: 420,
    savings: 318,
    markup: "312%",
    timeAgo: "3 days ago",
    isSaved: true,
    image:
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600&h=600",
    materialCost: 102,
  },
  {
    id: "6",
    name: "Ray-Ban Aviators",
    category: "Accessories",
    retailPrice: 210,
    savings: 168,
    markup: "400%",
    timeAgo: "5 days ago",
    isSaved: false,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600&h=600",
    materialCost: 42,
  },
];
