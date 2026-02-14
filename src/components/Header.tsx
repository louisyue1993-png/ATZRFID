'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ShoppingCart, Globe } from 'lucide-react';
import { productCategories } from '@/data/productCategories';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState('en');

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'zh' : 'en');
  };

  const t = lang === 'en' ? en : zh;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/logo.svg"
              alt="ATZ RFID Logo"
              className="h-12 w-auto rounded-lg shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors relative group"
            >
              {t.home}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Products Dropdown */}
            <div className="relative group">
              <button className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1 relative group/btn">
                {t.products}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/btn:w-full transition-all duration-300"></span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-0 w-72 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-xl shadow-slate-500/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-1 translate-y-2">
                <div className="p-2">
                  <Link
                    href="/products"
                    className="block px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all font-semibold"
                  >
                    All Products
                  </Link>
                  <div className="border-t border-slate-100 my-2"></div>
                  {productCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.id}`}
                      className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-all"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/about"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors relative group"
            >
              {t.about}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link
              href="/blog"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors relative group"
            >
              {t.blog}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link
              href="/contact"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors relative group"
            >
              {t.contact}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="hidden md:flex hover:bg-slate-100"
            >
              <Globe className="h-5 w-5 text-slate-600" />
              <span className="sr-only">Toggle Language</span>
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                <ShoppingCart className="h-5 w-5 text-slate-600" />
                <span className="sr-only">Cart</span>
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-slate-600" />
              ) : (
                <Menu className="h-6 w-6 text-slate-600" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 space-y-1">
            <Link
              href="/"
              className="block py-3 px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.home}
            </Link>

            {/* Mobile Products Section */}
            <div className="py-2">
              <Link
                href="/products"
                className="block py-3 px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.products}
              </Link>
              <div className="pl-4 space-y-1 mt-1">
                {productCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.id}`}
                    className="block py-2 px-4 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/about"
              className="block py-3 px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.about}
            </Link>
            <Link
              href="/blog"
              className="block py-3 px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.blog}
            </Link>
            <Link
              href="/contact"
              className="block py-3 px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.contact}
            </Link>

            <Button
              variant="ghost"
              onClick={toggleLanguage}
              className="w-full justify-start px-4 hover:bg-slate-50"
            >
              <Globe className="h-4 w-4 mr-2 text-slate-600" />
              <span className="text-sm font-semibold text-slate-900">{lang === 'en' ? '简体中文' : 'English'}</span>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}

// English translations
const en = {
  company: 'ATZ RFID',
  home: 'Home',
  products: 'Products',
  productsDesc: 'Explore our complete range of RFID products',
  rfidCards: 'RFID Cards',
  rfidTags: 'RFID Tags',
  rfidWristbands: 'RFID Wristbands',
  rfidLabels: 'RFID Labels',
  rfidInlays: 'RFID Inlays',
  nfcTags: 'NFC Tags',
  about: 'About',
  blog: 'Blog',
  contact: 'Contact',
};

// Chinese translations
const zh = {
  company: 'ATZ RFID',
  home: '首页',
  products: '产品',
  productsDesc: '探索我们完整的RFID产品系列',
  rfidCards: 'RFID卡',
  rfidTags: 'RFID标签',
  rfidWristbands: 'RFID腕带',
  rfidLabels: 'RFID贴纸',
  rfidInlays: 'RFID Inlay',
  nfcTags: 'NFC标签',
  about: '关于我们',
  blog: '博客',
  contact: '联系我们',
};
