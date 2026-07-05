export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  discountRate: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  aliexpressUrl: string;
  features: string[];
  freeShipping: boolean;
  deliveryDays: number;
  salesCount: number;
  storeName: string;
}

export interface AffiliateConfig {
  trackingId: string; // e.g. "my_affiliate_id"
  brandName: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  googleAnalyticsId: string;
  linkTemplate: string; // e.g. "https://s.click.aliexpress.com/e/_xxxxx?subId={trackingId}&dl_target_url={productUrl}"
}

export interface FilterState {
  searchQuery: string;
  category: string;
  sortBy: "popular" | "price-asc" | "price-desc" | "discount" | "rating";
  priceMin: string;
  priceMax: string;
  freeShippingOnly: boolean;
  wishlistOnly: boolean;
}
