import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  Settings, 
  Moon, 
  Sun, 
  RefreshCw, 
  FilterX, 
  SlidersHorizontal,
  ChevronDown,
  Info
} from "lucide-react";
import { MOCK_PRODUCTS, CATEGORIES } from "./data";
import { Product, AffiliateConfig, FilterState } from "./types";
import { ProductCard } from "./components/ProductCard";
import { AffiliateSettings } from "./components/AffiliateSettings";
import { ExportPanel } from "./components/ExportPanel";

const DEFAULT_CONFIG: AffiliateConfig = {
  trackingId: "ali_aff_2026",
  brandName: "AliHotdeals",
  tagline: "Discover Vetted Choice Gadgets and Tech Essentials Handpicked with Global Free Shipping",
  seoTitle: "AliHotdeals - Curated Choice Smart Electronics & Vetted AliExpress Deals",
  seoDescription: "Browse high-rated portable projectors, smart watches, and mechanical keyboards from AliExpress. Save up to 70% with active buyer protection.",
  seoKeywords: "aliexpress deals, affiliate store, smart gadgets, best discounts, tech reviews, free shipping",
  googleAnalyticsId: "",
  linkTemplate: "https://s.click.aliexpress.com/e/_example?subId={trackingId}&dl_target_url={productUrl}"
};

const DEFAULT_FILTERS: FilterState = {
  searchQuery: "",
  category: "All Products",
  sortBy: "popular",
  priceMin: "",
  priceMax: "",
  freeShippingOnly: false,
  wishlistOnly: false
};

export default function App() {
  // Config state
  const [config, setConfig] = useState<AffiliateConfig>(() => {
    const saved = localStorage.getItem("ali_aff_config");
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  // Active view tab: storefront deals vs configuration workspace
  const [activeTab, setActiveTab] = useState<"store" | "config">("store");

  // Filters state
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("ali_aff_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme-mode");
    return saved ? saved === "dark" : false;
  });

  // Apply configuration saves
  const handleSaveConfig = (newConfig: AffiliateConfig) => {
    setConfig(newConfig);
    localStorage.setItem("ali_aff_config", JSON.stringify(newConfig));
  };

  // Sync theme changes with DOM document class
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme-mode", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme-mode", "light");
    }
  }, [darkMode]);

  // Handle wishlist clicks
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const isAlreadyAdded = prev.includes(productId);
      const next = isAlreadyAdded 
        ? prev.filter((id) => id !== productId) 
        : [...prev, productId];
      localStorage.setItem("ali_aff_wishlist", JSON.stringify(next));
      return next;
    });
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Filtered products selector
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    // 1. Category check
    if (filters.category !== "All Products" && product.category !== filters.category) {
      return false;
    }
    // 2. Search search query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchStore = product.storeName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchStore) return false;
    }
    // 3. Price boundary min
    if (filters.priceMin) {
      const min = parseFloat(filters.priceMin);
      if (!isNaN(min) && product.price < min) return false;
    }
    // 4. Price boundary max
    if (filters.priceMax) {
      const max = parseFloat(filters.priceMax);
      if (!isNaN(max) && product.price > max) return false;
    }
    // 5. Free Shipping only
    if (filters.freeShippingOnly && !product.freeShipping) {
      return false;
    }
    // 6. Wishlist only
    if (filters.wishlistOnly && !wishlist.includes(product.id)) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    // Sorting implementation
    switch (filters.sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "discount":
        return b.discountRate - a.discountRate;
      case "rating":
        return b.rating - a.rating;
      case "popular":
      default:
        return b.salesCount - a.salesCount;
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-300">
      
      {/* Upper Navigation Rail */}
      <nav className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            {/* Left: Branding Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/20">
                <ShoppingBag size={20} className="stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  {config.brandName || "AliHotdeals"}
                </span>
                <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-widest mt-0.5">
                  Affiliate
                </span>
              </div>
            </div>

            {/* Middle: Tab view controller */}
            <div className="flex rounded-full bg-slate-100 p-1 dark:bg-zinc-800">
              <button
                onClick={() => setActiveTab("store")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "store"
                    ? "bg-white text-orange-500 shadow-xs dark:bg-zinc-700 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
                id="view-storefront-tab"
              >
                🔥 Curated Deals
              </button>
              <button
                onClick={() => setActiveTab("config")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "config"
                    ? "bg-white text-orange-500 shadow-xs dark:bg-zinc-700 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
                id="view-config-tab"
              >
                ⚙️ Control Console
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5">
              
              {/* Wishlist quick toggle */}
              <button
                onClick={() => handleFilterChange("wishlistOnly", !filters.wishlistOnly)}
                className={`relative flex h-9.5 items-center gap-2 rounded-full border px-4.5 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  filters.wishlistOnly
                    ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400"
                    : "border-slate-100 bg-slate-50 hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                }`}
                id="nav-wishlist-toggle"
              >
                <Heart size={14} fill={wishlist.length > 0 ? "currentColor" : "none"} className={wishlist.length > 0 ? "text-red-500" : ""} />
                <span className="hidden sm:inline">Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Theme switch */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex h-9.5 w-9.5 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
              </button>

            </div>

          </div>
        </div>
      </nav>

      {/* Main Content Body */}
      <AnimatePresence mode="wait">
        {activeTab === "store" ? (
          <motion.div
            key="storefront"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
          >
            {/* Hero Section */}
            <header className="relative mb-10 overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-orange-50/50 via-white to-orange-100/30 p-8 dark:border-zinc-800 dark:from-zinc-900/50 dark:via-zinc-900 dark:to-orange-950/10 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500 mb-4 dark:bg-red-500/20">
                ⭐ CHOICE PRODUCTS VETTED
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                Curated AliExpress Deals
              </h1>
              <p className="mx-auto mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-zinc-400">
                {config.tagline || "Handpicked trending gadgets, home automation, and computer components with continuous buyer protection."}
              </p>

              {/* Active SubId tracking confirmation */}
              <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/50 px-4 py-1.5 text-xs text-emerald-600 dark:border-emerald-950/20 dark:bg-emerald-950/10 dark:text-emerald-400">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Affiliate Monetization Active: <code className="font-bold">{config.trackingId || "none"}</code>
              </div>
            </header>

            {/* Workspace Marketplace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Left Column: Filter Sidebar (Desktop) */}
              <aside className="hidden lg:block space-y-6">
                
                {/* Search query box */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Search Products
                  </h3>
                  <div className="relative">
                    <Search className="absolute top-3.5 left-3 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Smartwatch, projector, Hub..."
                      value={filters.searchQuery}
                      onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                      className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pr-4 pl-9 text-xs outline-none focus:border-orange-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-orange-500 dark:focus:bg-zinc-950"
                    />
                  </div>
                </div>

                {/* Filters details card */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3 dark:border-zinc-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Market Filters
                    </h3>
                    <button
                      onClick={handleResetFilters}
                      className="flex items-center gap-1 text-[11px] font-semibold text-orange-500 hover:underline cursor-pointer"
                    >
                      <RefreshCw size={10} /> Reset
                    </button>
                  </div>

                  {/* Price boundaries */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-2">
                      Price Range ($)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceMin}
                        onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                        className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2 text-center text-xs outline-none focus:border-orange-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-orange-500 dark:focus:bg-zinc-950"
                      />
                      <span className="text-slate-300">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceMax}
                        onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                        className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2 text-center text-xs outline-none focus:border-orange-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-orange-500 dark:focus:bg-zinc-950"
                      />
                    </div>
                  </div>

                  {/* Toggle list (Shipping, etc.) */}
                  <div className="space-y-2.5 pt-2">
                    <label className="flex items-center gap-2.5 text-xs font-medium text-slate-600 dark:text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.freeShippingOnly}
                        onChange={(e) => handleFilterChange("freeShippingOnly", e.target.checked)}
                        className="h-4 w-4 rounded-md border-slate-200 text-orange-500 focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-950"
                      />
                      <span>Free Shipping Only</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs font-medium text-slate-600 dark:text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.wishlistOnly}
                        onChange={(e) => handleFilterChange("wishlistOnly", e.target.checked)}
                        className="h-4 w-4 rounded-md border-slate-200 text-orange-500 focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-950"
                      />
                      <span>In My Wishlist</span>
                    </label>
                  </div>
                </div>
              </aside>

              {/* Right Column: Active Marketplace Listings */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Mobile Search/Filter Row */}
                <div className="flex lg:hidden gap-3 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute top-3 left-3 text-slate-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={filters.searchQuery}
                      onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                      className="w-full rounded-full border border-slate-100 bg-white py-2.5 pr-4 pl-9 text-xs outline-none focus:border-orange-500 dark:border-zinc-800 dark:bg-zinc-900"
                    />
                  </div>
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="flex h-9.5 w-9.5 items-center justify-center rounded-full bg-white border border-slate-100 text-slate-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
                  >
                    <SlidersHorizontal size={16} />
                  </button>
                </div>

                {/* Mobile Expandable Filter drawer */}
                <AnimatePresence>
                  {showMobileFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="lg:hidden rounded-2xl bg-white border border-slate-100 p-4 dark:bg-zinc-900 dark:border-zinc-800 space-y-4 overflow-hidden"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-zinc-800">
                        <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Quick Filters</span>
                        <button onClick={handleResetFilters} className="text-xs text-orange-500 font-semibold">Reset</button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Min Price</label>
                          <input
                            type="number"
                            placeholder="$"
                            value={filters.priceMin}
                            onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                            className="w-full rounded-xl bg-slate-50 border border-slate-100 py-1.5 px-3 text-xs outline-none dark:bg-zinc-950 dark:border-zinc-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Max Price</label>
                          <input
                            type="number"
                            placeholder="$"
                            value={filters.priceMax}
                            onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                            className="w-full rounded-xl bg-slate-50 border border-slate-100 py-1.5 px-3 text-xs outline-none dark:bg-zinc-950 dark:border-zinc-800"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 pt-1">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-300">
                          <input
                            type="checkbox"
                            checked={filters.freeShippingOnly}
                            onChange={(e) => handleFilterChange("freeShippingOnly", e.target.checked)}
                            className="h-4 w-4 rounded text-orange-500"
                          />
                          <span>Free Shipping</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-300">
                          <input
                            type="checkbox"
                            checked={filters.wishlistOnly}
                            onChange={(e) => handleFilterChange("wishlistOnly", e.target.checked)}
                            className="h-4 w-4 rounded text-orange-500"
                          />
                          <span>In Wishlist</span>
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sub-menu: Category pill selectors and Sort dropdown */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                  {/* Category select sliders */}
                  <div className="flex gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none select-none">
                    {CATEGORIES.map((cat) => {
                      const isActive = filters.category === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => handleFilterChange("category", cat)}
                          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                            isActive
                              ? "bg-orange-500 text-white shadow-sm"
                              : "bg-white text-slate-600 border border-slate-100 hover:border-orange-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Sorting dropdown selector */}
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                    <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Sort:</span>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                      className="rounded-xl border border-slate-100 bg-white px-3 py-1.5 text-xs outline-none dark:border-zinc-800 dark:bg-zinc-900 font-semibold text-slate-600 dark:text-zinc-300 cursor-pointer"
                    >
                      <option value="popular">Popularity</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="discount">Highest Discount</option>
                      <option value="rating">Top Customer Rated</option>
                    </select>
                  </div>
                </div>

                {/* Filter indicator alerts */}
                {filters.wishlistOnly && (
                  <div className="rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100/50 dark:border-orange-500/10 p-4.5 flex justify-between items-center">
                    <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                      Currently viewing items added to your wishlist only ({wishlist.length} items total)
                    </p>
                    <button
                      onClick={() => handleFilterChange("wishlistOnly", false)}
                      className="text-xs font-bold text-orange-500 hover:underline cursor-pointer"
                    >
                      Show All Deals
                    </button>
                  </div>
                )}

                {/* Main Products Grid */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {filteredProducts.map((prod) => (
                        <ProductCard
                          key={prod.id}
                          product={prod}
                          config={config}
                          isWishlisted={wishlist.includes(prod.id)}
                          onToggleWishlist={handleToggleWishlist}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-16 border border-dashed border-slate-100 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900">
                    <FilterX size={44} className="mx-auto text-slate-300 mb-3" />
                    <h3 className="font-bold text-base text-slate-700 dark:text-zinc-300">No curations matched your filters</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                      Try removing some filters, emptying your search query, or disabling the wishlist filter to discover more products.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-4.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}

              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="config-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8"
          >
            {/* Console Heading banner */}
            <div className="rounded-3xl border border-amber-100 bg-amber-50/20 dark:border-amber-950/20 dark:bg-amber-950/10 p-5 flex gap-3 text-amber-800 dark:text-amber-400 text-xs leading-relaxed">
              <Info size={18} className="shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Affiliate Developer Workspace:</strong> Customize your tracking metrics or compile/export this entire layout into a single, lightning-fast static responsive Bootstrap web page! You can upload it to GitHub and publish it instantly to <strong className="text-orange-500">GitHub Pages</strong> completely free.
              </div>
            </div>

            {/* Config Panel */}
            <AffiliateSettings config={config} onSaveConfig={handleSaveConfig} />

            {/* Exporter Panel */}
            <ExportPanel config={config} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Branding Area */}
      <footer className="border-t border-slate-100 bg-white py-12 dark:border-zinc-900 dark:bg-zinc-900/40 text-slate-400 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pb-8 border-b border-slate-50 dark:border-zinc-800/60">
            <div>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">{config.brandName || "AliHotdeals"}</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                Vetted premium gadget selections from AliExpress. Dynamic link rewriting active for Affiliate ID: <code className="font-bold text-orange-500">{config.trackingId || "none"}</code>
              </p>
            </div>
            
            <div className="text-xs font-medium max-w-xs text-slate-400 sm:text-right leading-relaxed">
              As an AliExpress partner, we earn from qualifying transactions via affiliate placeholders.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] pt-8">
            <span>&copy; 2026 {config.brandName || "AliHotdeals"}. Handcrafted for Affiliate Program Success.</span>
            <div className="flex gap-4">
              <span className="hover:text-slate-600 cursor-pointer">Terms of Use</span>
              <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-600 cursor-pointer">Affiliate Disclosure</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
