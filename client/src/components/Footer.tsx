import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-16" data-testid="footer-main">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">SkinLite.</h3>
            <p className="text-sm text-slate-600">
              Clean, effective skincare for your daily routine.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products">
                  <span className="text-sm text-slate-600 hover:text-cyan-500 cursor-pointer">Products</span>
                </Link>
              </li>
              <li>
                <Link href="/check-order">
                  <span className="text-sm text-slate-600 hover:text-cyan-500 cursor-pointer">Check Order</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-sm text-slate-600 hover:text-cyan-500 cursor-pointer">Contact</span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Support</h4>
            <ul className="space-y-2">
              <li className="text-sm text-slate-600">Email: hello@skinlite.co</li>
              <li className="text-sm text-slate-600">WhatsApp: +62 812-xxxx-xxxx</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 mt-8 pt-8">
          <p className="text-sm text-slate-600 text-center">
            © 2025 SkinLite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
