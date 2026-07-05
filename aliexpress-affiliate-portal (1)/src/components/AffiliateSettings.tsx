import React, { useState } from "react";
import { Settings, Tag, Shield, HelpCircle, Save, CheckCircle, Globe, Link2, Copy, AlertCircle } from "lucide-react";
import { AffiliateConfig } from "../types";

interface AffiliateSettingsProps {
  config: AffiliateConfig;
  onSaveConfig: (newConfig: AffiliateConfig) => void;
}

export const AffiliateSettings: React.FC<AffiliateSettingsProps> = ({
  config,
  onSaveConfig,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "link" | "seo" | "guide">("general");
  const [formData, setFormData] = useState<AffiliateConfig>({ ...config });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopyTemplate = (template: string) => {
    setFormData((prev) => ({ ...prev, linkTemplate: template }));
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900" id="affiliate-settings-panel">
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
            <Settings size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Affiliate Control Console</h2>
            <p className="text-xs text-gray-400">Configure your global monetization, brand, and SEO identity</p>
          </div>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle size={14} /> Saved and applied dynamically!
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-gray-100 dark:border-zinc-800 md:pr-6 md:w-56 shrink-0">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
              activeTab === "general"
                ? "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
            }`}
          >
            <Shield size={16} /> Brand & Tracking ID
          </button>
          <button
            onClick={() => setActiveTab("link")}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
              activeTab === "link"
                ? "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
            }`}
          >
            <Link2 size={16} /> Link Deep Linking
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
              activeTab === "seo"
                ? "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
            }`}
          >
            <Globe size={16} /> SEO & Marketing
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
              activeTab === "guide"
                ? "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
            }`}
          >
            <HelpCircle size={16} /> Setup Tutorial
          </button>
        </div>

        {/* Tab Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-[280px]">
          {activeTab === "general" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1.5">
                    AliExpress Tracking ID (Admitad / SubID)
                  </label>
                  <input
                    type="text"
                    name="trackingId"
                    value={formData.trackingId}
                    onChange={handleChange}
                    placeholder="e.g. alipromo_2026"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-orange-500"
                  />
                  <p className="mt-1 text-[11px] text-gray-400">
                    This ID is appended to all dynamic product links to credit sales to your affiliate account.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1.5">
                    Affiliate Portal Brand Name
                  </label>
                  <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    placeholder="e.g. AliHotdeals"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-orange-500"
                  />
                  <p className="mt-1 text-[11px] text-gray-400">
                    Sets the logo and branding title across the headers and footers.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1.5">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="The Ultimate Curated AliExpress Hotdeals Finder"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-orange-500"
                />
              </div>
            </div>
          )}

          {activeTab === "link" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1.5">
                  Link Generation Template
                </label>
                <input
                  type="text"
                  name="linkTemplate"
                  value={formData.linkTemplate}
                  onChange={handleChange}
                  placeholder="https://s.click.aliexpress.com/e/_xxxxx?subId={trackingId}&dl_target_url={productUrl}"
                  className="w-full font-mono rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-orange-500"
                />
                <p className="mt-1.5 text-[11px] text-gray-400 leading-relaxed">
                  Use <code className="font-semibold text-orange-500">{`{trackingId}`}</code> and <code className="font-semibold text-orange-500">{`{productUrl}`}</code> placeholders. In our engine, these will replace dynamically with your parameters before the user navigates.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">
                  Quick Select Templates (Click to fill)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyTemplate("https://s.click.aliexpress.com/e/_example?subId={trackingId}&dl_target_url={productUrl}")}
                    className="flex flex-col text-left p-3 rounded-xl border border-gray-100 hover:border-orange-300 bg-gray-50 hover:bg-orange-50/20 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-orange-500/30 transition-all text-xs"
                  >
                    <span className="font-bold text-gray-700 dark:text-zinc-300">AliExpress Portals / Admitad Link</span>
                    <span className="text-gray-400 mt-1 truncate">.../e/_example?subId={`{trackingId}`}&dl_target_url={`{productUrl}`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyTemplate("https://aliexpress.com/item/{productUrl}?aff_platform=default&sk={trackingId}")}
                    className="flex flex-col text-left p-3 rounded-xl border border-gray-100 hover:border-orange-300 bg-gray-50 hover:bg-orange-50/20 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-orange-500/30 transition-all text-xs"
                  >
                    <span className="font-bold text-gray-700 dark:text-zinc-300">AliExpress Native Direct Affiliate</span>
                    <span className="text-gray-400 mt-1 truncate">...item/{`{productUrl}`}?aff_platform=default&sk={`{trackingId}`}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1.5">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleChange}
                    placeholder="e.g. Best Curated AliExpress Deals - Handpicked Products"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1.5">
                    Google Analytics ID (GT-XXXX)
                  </label>
                  <input
                    type="text"
                    name="googleAnalyticsId"
                    value={formData.googleAnalyticsId}
                    onChange={handleChange}
                    placeholder="e.g. G-Y39XW8N1LZ"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1.5">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  name="seoKeywords"
                  value={formData.seoKeywords}
                  onChange={handleChange}
                  placeholder="aliexpress deals, affiliate store, smart gadgets, best discounts, tech reviews"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1.5">
                  SEO Meta Description
                </label>
                <textarea
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Find the highest-rated gadgets, home appliances, and smart fitness trackers on AliExpress at rock bottom prices with vetted buyer-protection policies."
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-orange-500"
                />
              </div>
            </div>
          )}

          {activeTab === "guide" && (
            <div className="space-y-3 text-xs leading-relaxed text-gray-600 dark:text-zinc-300">
              <h3 className="font-bold text-gray-800 dark:text-white text-sm">How to monetize this AliExpress portal?</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  <strong className="text-gray-800 dark:text-white">Get an AliExpress Affiliate Account:</strong> Register for free on the official <a href="https://portals.aliexpress.com/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">AliExpress Portals</a> or secondary platforms like <a href="https://www.admitad.com/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">Admitad</a>.
                </li>
                <li>
                  <strong className="text-gray-800 dark:text-white">Retrieve Your Tracking Link:</strong> Set up a link generator in portals or obtain your unique Link Tracking ID / subId.
                </li>
                <li>
                  <strong className="text-gray-800 dark:text-white">Configure the Control Panel:</strong> Paste your unique tracking code into the <strong className="text-orange-500">Brand & Tracking ID</strong> tab above, save configuration, and watch all purchase buttons update instantly!
                </li>
                <li>
                  <strong className="text-gray-800 dark:text-white">Deploy static build:</strong> Use our integrated <strong className="text-orange-500">Static site exporter</strong> below to generate a single-file Bootstrap index.html or package a ZIP archive. Copy/deploy directly on GitHub Pages!
                </li>
              </ol>

              <div className="mt-4 flex items-start gap-2 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 p-3 text-gray-500 border border-orange-100/50 dark:border-orange-500/10">
                <AlertCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />
                <p className="text-[10.5px]">
                  All changes are fully persistent in your local browser cache (localStorage). Exporting your source code via our exporter also configures these variables inside your static output automatically!
                </p>
              </div>
            </div>
          )}

          {/* Form Action */}
          {activeTab !== "guide" && (
            <div className="mt-auto pt-6 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 text-white px-5 py-2.5 text-xs font-bold transition-all hover:shadow-md active:scale-95 cursor-pointer"
              >
                <Save size={14} /> Save Configuration
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
