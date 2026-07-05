import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Heart, ExternalLink, ShieldCheck, Truck, ShoppingBag, Eye, X, Check } from "lucide-react";
import { Product, AffiliateConfig } from "../types";

interface ProductCardProps {
  product: Product;
  config: AffiliateConfig;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  config,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate dynamic affiliate link based on tracking config
  const getAffiliateLink = () => {
    if (!config.trackingId) return product.aliexpressUrl;
    
    // Default or custom template matching
    let url = config.linkTemplate;
    if (url.includes("{trackingId}")) {
      url = url.replace("{trackingId}", encodeURIComponent(config.trackingId));
    }
    if (url.includes("{productUrl}")) {
      url = url.replace("{productUrl}", encodeURIComponent(product.aliexpressUrl));
    } else {
      // Fallback: append tracking parameter
      const separator = product.aliexpressUrl.includes("?") ? "&" : "?";
      return `${product.aliexpressUrl}${separator}aff_platform=default&sk=custom&aff_trace_key=${config.trackingId}`;
    }
    return url;
  };

  const affLink = getAffiliateLink();

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(affLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition-all duration-300 hover:border-orange-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-500/30"
        id={`product-card-${product.id}`}
      >
        {/* Discount Badge */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white shadow-xs">
            -{product.discountRate}% OFF
          </span>
          {product.freeShipping && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-semibold text-white shadow-xs">
              <Truck size={10} /> Free Shipping
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className={`absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white/80 backdrop-blur-md shadow-xs transition-all hover:scale-105 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800/80 ${
            isWishlisted
              ? "text-red-500"
              : "text-gray-500 hover:text-red-500 dark:text-zinc-400"
          }`}
          aria-label="Toggle Wishlist"
          id={`wishlist-btn-${product.id}`}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-zinc-950">
          <img
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          {/* Quick Peek Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-full bg-white px-4.5 py-2 text-sm font-semibold text-gray-900 shadow-lg hover:bg-orange-500 hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0"
            >
              <Eye size={16} /> Quick View
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col p-4.5">
          {/* Store Name & Sales */}
          <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-gray-400 dark:text-zinc-500">
            <span className="truncate max-w-[130px]">{product.storeName}</span>
            <span>{product.salesCount.toLocaleString()}+ sold</span>
          </div>

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 min-h-[40px] text-sm font-medium text-gray-800 transition-colors group-hover:text-orange-500 dark:text-zinc-200 dark:group-hover:text-orange-400">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="mb-3 flex items-center gap-1.5">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                  className="stroke-amber-400"
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-600 dark:text-zinc-400">
              {product.rating}
            </span>
            <span className="text-[11px] text-gray-400">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Pricing Row */}
          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              </div>
              <div className="text-[10px] font-semibold text-emerald-500">
                You save ${(product.originalPrice - product.price).toFixed(2)}
              </div>
            </div>

            {/* AliExpress Dynamic Affiliate Link */}
            <a
              href={affLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 text-white px-3.5 py-2 text-xs font-semibold transition-all hover:shadow-md active:scale-95"
              id={`buy-btn-${product.id}`}
            >
              Buy <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
            >
              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              >
                <X size={16} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Left: Image & Quick Specs */}
                <div>
                  <div className="aspect-square overflow-hidden rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <span className="flex items-center gap-1 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 px-3 py-1 text-xs font-semibold">
                      <ShoppingBag size={12} /> {product.salesCount.toLocaleString()}+ Orders
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-semibold">
                      <Truck size={12} /> Est. {product.deliveryDays} Day Delivery
                    </span>
                  </div>
                </div>

                {/* Right: Info */}
                <div className="flex flex-col">
                  <span className="text-xs font-semibold tracking-wider text-orange-500 uppercase">
                    {product.category}
                  </span>
                  <h2 className="mt-1 text-xl font-bold leading-snug text-gray-900 dark:text-white">
                    {product.title}
                  </h2>

                  {/* Rating */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                          className="stroke-amber-400"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold">{product.rating}</span>
                    <span className="text-xs text-gray-500">
                      ({product.reviewsCount} verified customers)
                    </span>
                  </div>

                  {/* Pricing and saving */}
                  <div className="mt-4 rounded-2xl bg-gray-50 dark:bg-zinc-950 p-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-orange-500">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                      <span className="rounded-md bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 px-1.5 py-0.5 text-xs font-bold">
                        {product.discountRate}% OFF
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      AliExpress Buyer Protection Verified
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-xs leading-relaxed text-gray-500 dark:text-zinc-400">
                    {product.description}
                  </p>

                  {/* Features */}
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                      Key Highlights
                    </h4>
                    <ul className="space-y-1.5">
                      {product.features.map((feat, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-gray-600 dark:text-zinc-300">
                          <Check size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action row */}
                  <div className="mt-auto pt-6 flex gap-3">
                    <a
                      href={affLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 text-white py-3 text-sm font-bold transition-all shadow-md active:scale-95"
                    >
                      Buy on AliExpress <ExternalLink size={14} />
                    </a>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 px-4 py-3 text-xs font-semibold transition-all"
                    >
                      {copiedLink ? (
                        <>
                          <Check size={14} className="text-emerald-500" /> Copied!
                        </>
                      ) : (
                        <>
                          Share Link
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
