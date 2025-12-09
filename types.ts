export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: any;
}

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  size: 'small' | 'large' | 'tall';
}

export interface ImageGenerationConfig {
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
}

export type Language = 'it' | 'en';