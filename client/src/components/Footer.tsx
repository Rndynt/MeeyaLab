import { Link } from "wouter";
import { Instagram, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 mt-20" data-testid="footer-main">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-5">
            <h2 className="text-2xl font-light tracking-tight mb-4">MeeyaLab.</h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Clean, effective skincare for your daily routine. Simple formulas, real results.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@meeyalab.co"
                className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-sm font-medium mb-4 text-slate-900">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products">
                  <span className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">
                    All Products
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/check-order">
                  <span className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">
                    Track Order
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">
                    Contact Us
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-sm font-medium mb-4 text-slate-900">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>hello@meeyalab.co</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">
              © 2025 MeeyaLab. All rights reserved.
            </p>
            <div className="flex gap-6">
              <span className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">
                Privacy Policy
              </span>
              <span className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
