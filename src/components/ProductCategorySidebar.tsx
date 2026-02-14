'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, X, MessageCircle } from 'lucide-react';
import { productCategories, type ProductCategory, type SubCategory } from '@/data/productCategories';
import { cn } from '@/lib/utils';

interface ProductCategorySidebarProps {
  currentCategory?: string;
  currentSubCategory?: string;
  onClose?: () => void;
}

export default function ProductCategorySidebar({
  currentCategory,
  currentSubCategory,
  onClose,
}: ProductCategorySidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(currentCategory ? [currentCategory] : [])
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const isCategoryActive = (category: ProductCategory) => {
    if (currentCategory === category.slug) return true;
    if (category.subCategories.some(sub => sub.slug === currentSubCategory)) return true;
    return false;
  };

  const isSubCategoryActive = (subCategory: SubCategory) => {
    return currentSubCategory === subCategory.slug;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-80 bg-white/95 backdrop-blur-xl border-r border-slate-200 shadow-2xl shadow-slate-500/10 lg:static lg:z-0 lg:shadow-none",
          "transition-transform duration-300 ease-in-out",
          "overflow-y-auto"
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Product Categories</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg lg:hidden transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          )}
        </div>

        {/* All Products Link */}
        <div className="px-4 py-3 border-b border-slate-100">
          <Link
            href="/products"
            scroll={false}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              !currentCategory && !currentSubCategory
                ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            )}
            onClick={onClose}
          >
            <span className="text-xl">📦</span>
            <span>All Products</span>
          </Link>
        </div>

        {/* Categories */}
        <div className="px-4 py-4 space-y-2">
          {productCategories.map(category => (
            <div key={category.id} className="space-y-1">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                  isCategoryActive(category)
                    ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold shadow-sm"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {category.subCategories.length}
                  </span>
                </div>
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                )}
              </button>

              {/* Subcategories */}
              {expandedCategories.has(category.id) && (
                <div className="ml-8 space-y-1 mt-1">
                  {category.subCategories.map(subCategory => (
                    <Link
                      key={subCategory.id}
                      scroll={false}
                      href={`/products?category=${category.slug}&subcategory=${subCategory.slug}`}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200",
                        isSubCategoryActive(subCategory)
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                      onClick={onClose}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <span>{subCategory.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Info - Premium Design */}
        <div className="px-4 py-6 border-t border-slate-200 mt-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-bold text-slate-900">Need Help?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Can't find what you're looking for? Our RFID experts are here to help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
              onClick={onClose}
            >
              Contact Us
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
