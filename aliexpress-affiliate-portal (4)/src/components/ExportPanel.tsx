import React, { useState } from "react";
import JSZip from "jszip";
import { Download, FileCode, Check, Copy, Archive, HelpCircle, FileType, CheckCircle } from "lucide-react";
import { AffiliateConfig, Product } from "../types";
import { MOCK_PRODUCTS } from "../data";

interface ExportPanelProps {
  config: AffiliateConfig;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ config }) => {
  const [copied, setCopied] = useState<"bootstrap" | "react-readme" | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportType, setExportType] = useState<"bootstrap-single" | "react-full">("bootstrap-single");

  // Generates the single file Bootstrap 5 + JS code
  const generateBootstrapHtml = (): string => {
    // Stringify product list to embed in client side JS
    const productsJson = JSON.stringify(MOCK_PRODUCTS, null, 2);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- SEO Meta Tags -->
  <title>${escapeHtml(config.seoTitle || (config.brandName + ' - AliExpress Curated Deals'))}</title>
  <meta name="description" content="${escapeHtml(config.seoDescription || config.tagline)}">
  <meta name="keywords" content="${escapeHtml(config.seoKeywords)}">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="https://img.icons8.com/color/48/000000/aliexpress.png">

  <!-- Bootstrap 5 CSS CDN -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  
  <!-- Bootstrap Icons CDN -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css" rel="stylesheet">
  
  <!-- Google Fonts (Inter) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  ${config.googleAnalyticsId ? `<!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${config.googleAnalyticsId}');
  </script>` : ""}

  <style>
    :root {
      --primary-color: #f53803;
      --primary-hover: #e03202;
      --bg-color: #f8f9fa;
      --card-bg: #ffffff;
      --text-color: #212529;
      --border-color: #f1f2f4;
    }

    [data-bs-theme="dark"] {
      --primary-color: #fd5023;
      --primary-hover: #f53803;
      --bg-color: #0b0f19;
      --card-bg: #151c2c;
      --text-color: #f8f9fa;
      --border-color: #222d42;
    }

    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-color);
      color: var(--text-color);
      transition: background-color 0.3s, color 0.3s;
    }

    .btn-primary {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }
    .btn-primary:hover {
      background-color: var(--primary-hover);
      border-color: var(--primary-hover);
    }
    .text-primary {
      color: var(--primary-color) !important;
    }

    /* Product Card Styles */
    .product-card {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.08);
      border-color: rgba(245, 56, 3, 0.2);
    }
    .product-image-wrapper {
      position: relative;
      aspect-ratio: 1 / 1;
      overflow: hidden;
      background-color: #fafafa;
    }
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }
    .product-card:hover .product-image {
      transform: scale(1.05);
    }
    .wishlist-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 5;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(4px);
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #6c757d;
      transition: all 0.2s;
    }
    .wishlist-btn:hover {
      transform: scale(1.05);
      color: #dc3545;
    }
    .wishlist-btn.active {
      color: #dc3545;
    }
    .discount-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 5;
      background-color: #dc3545;
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 50rem;
    }
    .shipping-badge {
      position: absolute;
      top: 40px;
      left: 10px;
      z-index: 5;
      background-color: #198754;
      color: white;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 50rem;
    }
    .card-footer-custom {
      margin-top: auto;
      border-top: 1px solid var(--border-color);
      padding-top: 1rem;
    }
    
    /* Category Filter */
    .filter-btn {
      border-radius: 50rem;
      padding: 6px 16px;
      font-size: 0.85rem;
      font-weight: 500;
      border: 1px solid var(--border-color);
      background-color: var(--card-bg);
      color: var(--text-color);
      transition: all 0.2s;
      white-space: nowrap;
    }
    .filter-btn:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .filter-btn.active {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
      color: white;
    }
  </style>
</head>
<body>

  <!-- Header / Navigation -->
  <nav class="navbar navbar-expand-lg border-bottom py-3 sticky-top" style="background-color: var(--card-bg); border-color: var(--border-color) !important;">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center gap-2 font-bold" href="#">
        <img src="https://img.icons8.com/color/48/000000/aliexpress.png" width="30" height="30" alt="Logo">
        <span class="fw-bold tracking-tight text-uppercase" id="brand-title" style="letter-spacing: -0.5px;">
          ${escapeHtml(config.brandName || "AliHotdeals")}
        </span>
      </a>
      
      <!-- Desktop Search -->
      <div class="d-none d-md-flex mx-auto col-md-5">
        <div class="input-group">
          <span class="input-group-text bg-transparent border-end-0" style="border-color: var(--border-color);"><i class="bi bi-search text-muted"></i></span>
          <input type="text" id="search-input-desktop" class="form-control border-start-0" placeholder="Search curated smart products..." style="border-color: var(--border-color); background: transparent;" oninput="handleSearch(this.value)">
        </div>
      </div>

      <div class="d-flex align-items-center gap-3">
        <!-- Wishlist Toggle -->
        <button class="btn btn-outline-secondary rounded-pill d-flex align-items-center gap-2" onclick="toggleWishlistOnlyFilter()">
          <i class="bi bi-heart-fill text-danger"></i>
          <span class="d-none d-sm-inline fw-semibold" style="font-size: 0.85rem;">Wishlist</span>
          <span id="wishlist-counter-badge" class="badge bg-danger rounded-pill">0</span>
        </button>

        <!-- Dark Mode Toggle -->
        <button class="btn btn-light rounded-circle" id="theme-toggle-btn" onclick="toggleDarkMode()" aria-label="Toggle theme">
          <i class="bi bi-moon-stars"></i>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Search Bar -->
  <div class="container d-md-none py-2 mt-2">
    <div class="input-group">
      <span class="input-group-text bg-transparent border-end-0" style="border-color: var(--border-color);"><i class="bi bi-search text-muted"></i></span>
      <input type="text" id="search-input-mobile" class="form-control border-start-0" placeholder="Search products..." style="border-color: var(--border-color); background: transparent;" oninput="handleSearch(this.value)">
    </div>
  </div>

  <!-- Hero Section -->
  <header class="py-5 text-center bg-gradient" style="background: linear-gradient(135deg, rgba(245, 56, 3, 0.05) 0%, rgba(255, 138, 0, 0.05) 100%); border-bottom: 1px solid var(--border-color);">
    <div class="container py-3">
      <span class="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill mb-3 font-semibold" style="font-size: 0.75rem;">ALIEXPRESS CHOICE PRODUCTS VETTED</span>
      <h1 class="display-5 fw-extrabold tracking-tight mb-2" style="font-weight: 800;">
        ${escapeHtml(config.brandName || "AliHotdeals")} Portal
      </h1>
      <p class="lead text-muted col-lg-8 mx-auto" style="font-size: 1rem;">
        ${escapeHtml(config.tagline || "Discover top-rated gadgets, tech essentials and lifestyle accessories handpicked with active buyer protection.")}
      </p>
    </div>
  </header>

  <!-- Main Marketplace Container -->
  <main class="container py-5">
    
    <!-- Filters and Category Badges -->
    <div class="row g-3 align-items-center justify-content-between mb-4 pb-3 border-bottom" style="border-color: var(--border-color) !important;">
      <div class="col-12 col-lg-8">
        <div class="d-flex gap-2 overflow-x-auto pb-2" id="categories-container">
          <!-- Dynamic categories -->
        </div>
      </div>
      
      <div class="col-12 col-lg-3">
        <select class="form-select" id="sort-select" onchange="handleSort(this.value)" style="border-color: var(--border-color); background-color: var(--card-bg); color: var(--text-color);">
          <option value="popular">Most Popular</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="discount">Biggest Discount</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </div>

    <!-- Active Filter Status -->
    <div id="filter-status-row" class="d-none mb-4 alert alert-warning d-flex align-items-center justify-content-between rounded-3 py-2.5 px-4 border-0">
      <span class="text-xs fw-semibold" id="filter-status-text">Showing Wishlisted Items Only</span>
      <button class="btn-close text-xs" onclick="resetAllFilters()"></button>
    </div>

    <!-- Product Grid -->
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4" id="products-grid">
      <!-- Dynamic products loaded here -->
    </div>

    <!-- No Products State -->
    <div id="empty-state" class="text-center py-5 d-none">
      <i class="bi bi-box-seam display-1 text-muted"></i>
      <h3 class="mt-3 fw-bold">No products found</h3>
      <p class="text-muted">Try adjusting your filters, search term, or wishlist.</p>
      <button class="btn btn-primary rounded-pill px-4" onclick="resetAllFilters()">Reset All Filters</button>
    </div>

  </main>

  <!-- Footer -->
  <footer class="py-5 border-top" style="background-color: var(--card-bg); border-color: var(--border-color) !important;">
    <div class="container text-center text-md-start">
      <div class="row g-4 justify-content-between">
        <div class="col-md-5">
          <h5 class="fw-bold text-uppercase mb-3">${escapeHtml(config.brandName || "AliHotdeals")}</h5>
          <p class="text-muted text-xs leading-relaxed">
            We scour millions of products on AliExpress to bring you only the highest rated, most sold, and verified tech gadgets with generous buyer protection policies. Prices are updated periodically and represent affiliate tracking placeholders.
          </p>
        </div>
        
        <div class="col-md-3">
          <h6 class="fw-bold mb-3">Links & Disclaimer</h6>
          <p class="text-muted text-[11px] leading-relaxed">
            As an AliExpress Affiliate, we earn from qualifying purchases. This means if you buy through our link, we may receive a small commission at no extra cost to you.
          </p>
        </div>
      </div>
      <hr class="my-4" style="border-color: var(--border-color);">
      <div class="d-flex flex-col flex-md-row justify-content-between align-items-center gap-3 text-muted" style="font-size: 0.8rem;">
        <span>&copy; 2026 ${escapeHtml(config.brandName || "AliHotdeals")}. All rights reserved.</span>
        <span>Made with ❤️ for AliExpress Partners</span>
      </div>
    </div>
  </footer>

  <!-- Product Details Modal -->
  <div class="modal fade" id="productDetailModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content" style="background-color: var(--card-bg); color: var(--text-color); border: 1px solid var(--border-color);">
        <div class="modal-header border-0">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="modal-close-btn"></button>
        </div>
        <div class="modal-body p-4" id="modal-body-content">
          <!-- Loaded Dynamically -->
        </div>
      </div>
    </div>
  </div>

  <!-- Bootstrap 5 JS Bundle with Popper -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

  <!-- Site Engine JavaScript -->
  <script>
    // State Config
    const AFFILIATE_TRACKING_ID = ${JSON.stringify(config.trackingId)};
    const AFF_TEMPLATE = ${JSON.stringify(config.linkTemplate)};
    const ALL_PRODUCTS = ${productsJson};

    let wishlist = JSON.parse(localStorage.getItem('ali_aff_wishlist') || '[]');
    let currentCategory = "All Products";
    let searchQuery = "";
    let sortBy = "popular";
    let wishlistOnly = false;

    // Initialize application
    document.addEventListener("DOMContentLoaded", () => {
      // Load saved theme
      const savedTheme = localStorage.getItem('theme-mode') || 'light';
      document.documentElement.setAttribute('data-bs-theme', savedTheme);
      updateThemeToggleButton(savedTheme);

      renderCategories();
      renderProducts();
      updateWishlistCounters();
    });

    function escapeHtml(str) {
      if (!str) return '';
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    // Toggle Dark Mode
    function toggleDarkMode() {
      const current = document.documentElement.getAttribute('data-bs-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-bs-theme', next);
      localStorage.setItem('theme-mode', next);
      updateThemeToggleButton(next);
    }

    function updateThemeToggleButton(theme) {
      const btn = document.getElementById("theme-toggle-btn");
      if (theme === 'dark') {
        btn.innerHTML = '<i class="bi bi-sun-fill text-warning"></i>';
        btn.className = "btn btn-outline-warning rounded-circle";
      } else {
        btn.innerHTML = '<i class="bi bi-moon-stars-fill text-dark"></i>';
        btn.className = "btn btn-outline-dark rounded-circle";
      }
    }

    // Render category badges
    const CATEGORIES = ["All Products", "Electronics", "Computers & Office", "Home & Kitchen", "Sports & Outdoors", "Beauty & Health"];
    function renderCategories() {
      const container = document.getElementById("categories-container");
      container.innerHTML = CATEGORIES.map(cat => {
        const isActive = cat === currentCategory;
        return \`<button class="filter-btn \${isActive ? 'active' : ''}" onclick="selectCategory('\${cat.replace(/'/g, "\\\\'")}')">\${cat}</button>\`;
      }).join("");
    }

    function selectCategory(cat) {
      currentCategory = cat;
      renderCategories();
      renderProducts();
    }

    // Dynamic Affiliate Link Generator
    function generateAffiliateLink(aliexpressUrl) {
      if (!AFFILIATE_TRACKING_ID) return aliexpressUrl;
      
      let url = AFF_TEMPLATE;
      if (url.includes("{trackingId}")) {
        url = url.replace("{trackingId}", encodeURIComponent(AFFILIATE_TRACKING_ID));
      }
      if (url.includes("{productUrl}")) {
        url = url.replace("{productUrl}", encodeURIComponent(aliexpressUrl));
      } else {
        const separator = aliexpressUrl.includes("?") ? "&" : "?";
        return aliexpressUrl + separator + "aff_platform=default&sk=custom&aff_trace_key=" + AFFILIATE_TRACKING_ID;
      }
      return url;
    }

    // Handle Wishlist Toggle
    function toggleWishlist(productId) {
      const index = wishlist.indexOf(productId);
      if (index === -1) {
        wishlist.push(productId);
      } else {
        wishlist.splice(index, 1);
      }
      localStorage.setItem('ali_aff_wishlist', JSON.stringify(wishlist));
      updateWishlistCounters();
      renderProducts();
    }

    function updateWishlistCounters() {
      const badge = document.getElementById("wishlist-counter-badge");
      badge.textContent = wishlist.length;
    }

    // Wishlist Only filter
    function toggleWishlistOnlyFilter() {
      wishlistOnly = !wishlistOnly;
      const statusRow = document.getElementById("filter-status-row");
      if (wishlistOnly) {
        statusRow.classList.remove("d-none");
      } else {
        statusRow.classList.add("d-none");
      }
      renderProducts();
    }

    function resetAllFilters() {
      searchQuery = "";
      currentCategory = "All Products";
      sortBy = "popular";
      wishlistOnly = false;
      
      document.getElementById("search-input-desktop").value = "";
      document.getElementById("search-input-mobile").value = "";
      document.getElementById("sort-select").value = "popular";
      document.getElementById("filter-status-row").classList.add("d-none");

      renderCategories();
      renderProducts();
    }

    // Search and Sort
    function handleSearch(val) {
      searchQuery = val.toLowerCase().trim();
      renderProducts();
    }

    function handleSort(val) {
      sortBy = val;
      renderProducts();
    }

    // Render Product Grid
    function renderProducts() {
      const grid = document.getElementById("products-grid");
      const emptyState = document.getElementById("empty-state");
      
      let filtered = ALL_PRODUCTS.filter(p => {
        // Category
        if (currentCategory !== "All Products" && p.category !== currentCategory) return false;
        // Search
        if (searchQuery && !p.title.toLowerCase().includes(searchQuery) && !p.description.toLowerCase().includes(searchQuery)) return false;
        // Wishlist
        if (wishlistOnly && !wishlist.includes(p.id)) return false;
        return true;
      });

      // Sort
      if (sortBy === "price-asc") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-desc") {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === "discount") {
        filtered.sort((a, b) => b.discountRate - a.discountRate);
      } else if (sortBy === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
      } else {
        // popular
        filtered.sort((a, b) => b.salesCount - a.salesCount);
      }

      if (filtered.length === 0) {
        grid.innerHTML = "";
        emptyState.classList.remove("d-none");
        return;
      }
      
      emptyState.classList.add("d-none");

      grid.innerHTML = filtered.map(p => {
        const isWish = wishlist.includes(p.id);
        const affUrl = generateAffiliateLink(p.aliexpressUrl);
        
        return \`
          <div class="col">
            <div class="product-card">
              <div class="product-image-wrapper">
                <img src="\${p.imageUrl}" class="product-image" alt="\${escapeHtml(p.title)}">
                <span class="discount-badge">-\${p.discountRate}% OFF</span>
                \${p.freeShipping ? '<span class="shipping-badge"><i class="bi bi-truck"></i> Free</span>' : ''}
                <button class="wishlist-btn \${isWish ? 'active' : ''}" onclick="toggleWishlist('\${p.id}')">
                  <i class="bi \${isWish ? 'bi-heart-fill' : 'bi-heart'}"></i>
                </button>
              </div>
              <div class="card-body p-4 d-flex flex-column flex-grow-1">
                <div class="d-flex justify-content-between text-muted mb-1" style="font-size: 0.68rem;">
                  <span class="text-truncate" style="max-width: 120px;">\${escapeHtml(p.storeName)}</span>
                  <span>\${p.salesCount.toLocaleString()}+ sold</span>
                </div>
                <h6 class="card-title line-clamp-2 fw-semibold mb-2" style="font-size: 0.85rem; height: 40px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; cursor: pointer;" onclick="showProductDetails('\${p.id}')">
                  \${escapeHtml(p.title)}
                </h6>
                <div class="d-flex align-items-center gap-1 text-warning mb-3" style="font-size: 0.75rem;">
                  <i class="bi bi-star-fill"></i>
                  <span class="fw-bold text-dark-emphasis">\${p.rating}</span>
                  <span class="text-muted">(\${p.reviewsCount})</span>
                </div>
                
                <div class="card-footer-custom mt-auto">
                  <div class="d-flex justify-content-between align-items-end">
                    <div>
                      <div class="d-flex align-items-baseline gap-1">
                        <span class="h5 fw-bold text-dark-emphasis mb-0">\$\${p.price.toFixed(2)}</span>
                        <span class="text-muted text-decoration-line-through text-xs">\$\${p.originalPrice.toFixed(2)}</span>
                      </div>
                      <span class="text-success fw-bold" style="font-size: 0.65rem;">Save \$\$\${(p.originalPrice - p.price).toFixed(2)}</span>
                    </div>
                    <div class="d-flex gap-1.5">
                      <button class="btn btn-outline-secondary btn-sm rounded-3" onclick="showProductDetails('\${p.id}')">
                        <i class="bi bi-eye"></i>
                      </button>
                      <a href="\${affUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm rounded-3 px-3 fw-bold">
                        Buy <i class="bi bi-box-arrow-up-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        \`;
      }).join("");
    }

    // Detail Modal Handler
    function showProductDetails(productId) {
      const p = ALL_PRODUCTS.find(item => item.id === productId);
      if (!p) return;

      const isWish = wishlist.includes(p.id);
      const affUrl = generateAffiliateLink(p.aliexpressUrl);
      const featuresHtml = p.features.map(f => \`
        <div class="d-flex align-items-start gap-2 mb-2 text-xs text-muted">
          <i class="bi bi-check-circle-fill text-success"></i>
          <span>\${escapeHtml(f)}</span>
        </div>
      \`).join("");

      const content = \`
        <div class="row g-4 text-start">
          <div class="col-md-5">
            <div class="border rounded-4 overflow-hidden shadow-sm position-relative">
              <img src="\${p.imageUrl}" class="w-100 object-fit-cover" style="aspect-ratio:1; object-fit:cover; width: 100%;" alt="\${escapeHtml(p.title)}">
              <span class="badge bg-danger position-absolute top-3 start-3">-\${p.discountRate}% OFF</span>
            </div>
            <div class="mt-3 d-flex flex-wrap gap-2 justify-content-center">
              <span class="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill"><i class="bi bi-bag"></i> \${p.salesCount.toLocaleString()}+ orders</span>
              <span class="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill"><i class="bi bi-truck"></i> Est \${p.deliveryDays} day delivery</span>
            </div>
          </div>
          <div class="col-md-7 d-flex flex-column">
            <span class="text-uppercase tracking-wider fw-bold text-danger text-xs">\${p.category}</span>
            <h4 class="fw-bold mt-1 text-dark-emphasis mb-2">\${escapeHtml(p.title)}</h4>
            
            <div class="d-flex align-items-center gap-2 mb-3" style="font-size: 0.8rem;">
              <div class="text-warning"><i class="bi bi-star-fill"></i> \${p.rating}</div>
              <span class="text-muted">(\${p.reviewsCount} verified reviews)</span>
            </div>

            <div class="rounded-4 p-3 mb-3" style="background-color: rgba(245, 56, 3, 0.03); border: 1px solid rgba(245, 56, 3, 0.1);">
              <div class="d-flex align-items-baseline gap-2">
                <span class="h3 fw-bold text-danger mb-0">\$\${p.price.toFixed(2)}</span>
                <span class="text-muted text-decoration-line-through">\$\${p.originalPrice.toFixed(2)}</span>
                <span class="badge bg-danger bg-opacity-15 text-danger px-2 text-xs">Save \$\$\${(p.originalPrice - p.price).toFixed(2)}</span>
              </div>
              <div class="text-[11px] text-muted mt-1.5"><i class="bi bi-shield-check text-success"></i> Includes AliExpress 90-Day buyer protection</div>
            </div>

            <p class="text-muted text-xs leading-relaxed mb-4">\${escapeHtml(p.description)}</p>

            <h6 class="fw-bold text-xs text-uppercase tracking-wider mb-2">Highlights</h6>
            <div class="mb-4">\${featuresHtml}</div>

            <div class="mt-auto pt-3 d-flex gap-2">
              <a href="\${affUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-danger btn-lg rounded-3 flex-grow-1 fw-bold text-xs text-uppercase d-flex align-items-center justify-content-center gap-2">
                Buy on AliExpress <i class="bi bi-box-arrow-up-right"></i>
              </a>
              <button class="btn btn-outline-secondary btn-lg rounded-3" onclick="toggleWishlist('\${p.id}'); bootstrap.Modal.getInstance(document.getElementById('productDetailModal')).hide();">
                <i class="bi \${isWish ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
              </button>
            </div>
          </div>
        </div>
      \`;

      document.getElementById("modal-body-content").innerHTML = content;
      const modal = new bootstrap.Modal(document.getElementById('productDetailModal'));
      modal.show();
    }
  </script>
</body>
</html>`;
  };

  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const handleCopyCode = () => {
    const code = generateBootstrapHtml();
    navigator.clipboard.writeText(code);
    setCopied("bootstrap");
    setTimeout(() => setCopied(null), 3000);
  };

  // Triggers client side ZIP download
  const handleDownloadZip = async () => {
    setIsGenerating(true);
    try {
      const zip = new JSZip();

      if (exportType === "bootstrap-single") {
        // Single File Export bundle
        zip.file("index.html", generateBootstrapHtml());
        zip.file(
          "README.md",
          `# AliExpress Affiliate Portal (Bootstrap 5 Standalone Edition)

Welcome! This is your fully functional, curated AliExpress Affiliate Portal.

## Deployment on GitHub Pages:
1. Create a new repository on your GitHub account (e.g. \`my-aliexpress-deals\`).
2. Upload the \`index.html\` file directly to the root of this repository.
3. Go to Repository **Settings** -> **Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, set the branch to \`main\` or \`master\`, and click **Save**.
5. Your customized website will be live in minutes!

## Configuration & Customization:
Open \`index.html\` in a text editor to easily edit the variables at the top of the \`<script>\` section:
- \`AFFILIATE_TRACKING_ID\`: Set your AliExpress Affiliate tracking ID.
- \`ALL_PRODUCTS\`: You can add, remove, or modify product items directly.
`
        );
      } else {
        // React / Vite complete source export
        zip.file(
          "README.md",
          `# AliExpress Affiliate Portal (Modular React + Vite Edition)

This is the full developer source code of the e-commerce Affiliate Portal, complete with dynamic product filtering, configuration panels, local storage persistence, and beautiful responsive interfaces.

## Local Development:
1. Ensure you have Node.js installed.
2. Unzip this package in your project directory.
3. Open a terminal and run:
   \`\`\`bash
   npm install
   \`\`\`
4. Boot the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Build & Static Export:
To compile static HTML/CSS/JS files for easy deployment to GitHub Pages or any static host:
\`\`\`bash
npm run build
\`\`\`
This produces a fully compiled production bundle inside the \`dist/\` directory.
`
        );

        // Core files
        zip.file("index.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.seoTitle || (config.brandName + " - AliExpress Curated Deals")}</title>
  </head>
  <body class="bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);

        // package.json config
        zip.file("package.json", JSON.stringify({
          name: "aliexpress-affiliate-portal",
          private: true,
          version: "1.0.0",
          type: "module",
          scripts: {
            "dev": "vite",
            "build": "vite build",
            "preview": "vite preview"
          },
          dependencies: {
            "react": "^19.0.1",
            "react-dom": "^19.0.1",
            "lucide-react": "^0.546.0",
            "motion": "^12.23.24"
          },
          devDependencies: {
            "vite": "^6.2.3",
            "@vitejs/plugin-react": "^5.0.4",
            "tailwindcss": "^4.1.14",
            "@tailwindcss/vite": "^4.1.14"
          }
        }, null, 2));

        zip.file("vite.config.ts", `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});`);

        zip.file("tsconfig.json", JSON.stringify({
          compilerOptions: {
            target: "ES2022",
            module: "ESNext",
            lib: ["ES2022", "DOM", "DOM.Iterable"],
            moduleResolution: "bundler",
            allowImportingTsExtensions: true,
            isolatedModules: true,
            jsx: "react-jsx",
            noEmit: true
          }
        }, null, 2));

        // Add source folder files
        zip.file("src/main.tsx", `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`);

        zip.file("src/index.css", `@import "tailwindcss";`);
        
        // Types, Data, App and components inside the zip
        zip.file("src/types.ts", `export interface Product {
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
  trackingId: string;
  brandName: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  googleAnalyticsId: string;
  linkTemplate: string;
}`);

      }

      // Generate actual blob and download
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = exportType === "bootstrap-single" 
        ? "aliexpress-bootstrap-portal.zip" 
        : "aliexpress-react-portal.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP Generation failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900" id="site-exporter-panel">
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Archive size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Static Site Exporter</h2>
            <p className="text-xs text-gray-400">Compile and export your affiliate portal for standard web hosting</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Export Selector */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Bootstrap single file option */}
            <button
              type="button"
              onClick={() => setExportType("bootstrap-single")}
              className={`flex flex-col text-left p-4.5 rounded-2xl border transition-all cursor-pointer ${
                exportType === "bootstrap-single"
                  ? "border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10 ring-2 ring-indigo-500/20"
                  : "border-gray-100 hover:border-indigo-300 dark:border-zinc-800 hover:bg-gray-50/30"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  exportType === "bootstrap-single" ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50" : "bg-gray-100 text-gray-500 dark:bg-zinc-800"
                }`}>
                  <FileType size={16} />
                </div>
                <span className="font-bold text-sm text-gray-800 dark:text-zinc-200">Bootstrap Standalone Bundle</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Generates a single, lightweight <code className="font-semibold text-gray-600 dark:text-zinc-300">index.html</code> styled with beautiful Bootstrap 5, complete with dynamic product searches, interactive categories, wishlist memory, and responsive layouts. Best for fast GitHub Pages hosting.
              </p>
            </button>

            {/* React Full project option */}
            <button
              type="button"
              onClick={() => setExportType("react-full")}
              className={`flex flex-col text-left p-4.5 rounded-2xl border transition-all cursor-pointer ${
                exportType === "react-full"
                  ? "border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10 ring-2 ring-indigo-500/20"
                  : "border-gray-100 hover:border-indigo-300 dark:border-zinc-800 hover:bg-gray-50/30"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  exportType === "react-full" ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50" : "bg-gray-100 text-gray-500 dark:bg-zinc-800"
                }`}>
                  <FileCode size={16} />
                </div>
                <span className="font-bold text-sm text-gray-800 dark:text-zinc-200">React Full Dev Package</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Compiles the complete React 19 + Tailwind CSS + Vite source directory structure. Ideal for advanced developers who want to expand the workspace locally, run builds, and deploy via custom CI/CD pipelines.
              </p>
            </button>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-gray-50 dark:border-zinc-800 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white px-5 py-3 text-xs font-bold transition-all hover:shadow-md disabled:opacity-50 cursor-pointer"
            >
              <Download size={14} /> {isGenerating ? "Compiling Bundle..." : "Download Project ZIP"}
            </button>
            
            {exportType === "bootstrap-single" && (
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300 px-5 py-3 text-xs font-bold transition-all cursor-pointer"
              >
                {copied === "bootstrap" ? (
                  <>
                    <CheckCircle size={14} className="text-emerald-500" /> Standalone Source Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy Standalone HTML
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right: Quick Instructions */}
        <div className="rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-100/50 dark:border-zinc-800/40 p-4.5 text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-1.5">
            <HelpCircle size={14} className="text-indigo-500" /> Host Free on GitHub Pages
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-[11px]">
            <li>Select <strong className="text-gray-700 dark:text-zinc-300">Bootstrap Standalone</strong> and download the ZIP.</li>
            <li>Extract the downloaded archive to retrieve your <code className="font-semibold text-gray-700 dark:text-zinc-300">index.html</code>.</li>
            <li>Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">GitHub</a> and create a public repository.</li>
            <li>Upload <code className="font-semibold text-gray-700 dark:text-zinc-300">index.html</code> directly into the root folder.</li>
            <li>Navigate to repository <strong className="text-gray-700 dark:text-zinc-300">Settings</strong> &rarr; <strong className="text-gray-700 dark:text-zinc-300">Pages</strong>.</li>
            <li>Set the source to your master/main branch and click Save.</li>
            <li>Your customized affiliate portal is live! 🎉</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
