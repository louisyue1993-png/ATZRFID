import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { productCategories } from '@/data/productCategories';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <img
              src="/logo.svg"
              alt="ATZ RFID Logo"
              className="h-8 w-auto mb-4"
            />
            <p className="mb-6 text-sm text-slate-400 leading-relaxed">
              Leading RFID manufacturer providing premium RFID products and solutions worldwide. 
              ISO 9001 certified quality with competitive wholesale pricing.
            </p>
            <div className="flex space-x-3 mb-6">
              <a
                href="#"
                className="p-2 bg-white/5 hover:bg-blue-600 rounded-lg transition-all duration-300 group"
              >
                <Facebook className="h-5 w-5 text-slate-400 group-hover:text-white" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="p-2 bg-white/5 hover:bg-blue-400 rounded-lg transition-all duration-300 group"
              >
                <Twitter className="h-5 w-5 text-slate-400 group-hover:text-white" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="p-2 bg-white/5 hover:bg-blue-700 rounded-lg transition-all duration-300 group"
              >
                <Linkedin className="h-5 w-5 text-slate-400 group-hover:text-white" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="#"
                className="p-2 bg-white/5 hover:bg-pink-600 rounded-lg transition-all duration-300 group"
              >
                <Instagram className="h-5 w-5 text-slate-400 group-hover:text-white" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Products</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/products" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  All Products
                </Link>
              </li>
              {productCategories.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/products?category=${category.id}`}
                    className="hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                </div>
                <a
                  href="mailto:info@atzrfid.com"
                  className="hover:text-blue-400 transition-colors mt-1"
                >
                  info@atzrfid.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                </div>
                <div>
                  <a
                    href="tel:+8617688964979"
                    className="hover:text-blue-400 transition-colors block"
                  >
                    +86 176 8896 4979
                  </a>
                  <a
                    href="https://wa.me/8617688964979"
                    className="hover:text-green-400 transition-colors block text-xs mt-1"
                  >
                    WhatsApp
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                </div>
                <span className="mt-1">
                  441F, Building 522<br />
                  Bagualing Industrial Zone<br />
                  Shenzhen, Guangdong, China
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} ATZ RFID. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/shipping"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
