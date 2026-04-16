import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-[#111] pt-16 pb-8 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-3xl font-serif font-bold tracking-tighter mb-4 block">
              AURA
            </Link>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              Discover a new era of fashion with our AI-powered virtual try-on experience. Minimalist luxury meets cutting-edge technology.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 uppercase tracking-wider text-sm">Shop</h4>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400">
              <li><Link href="/men" className="hover:text-black dark:hover:text-white transition">Men</Link></li>
              <li><Link href="/women" className="hover:text-black dark:hover:text-white transition">Women</Link></li>
              <li><Link href="/kids" className="hover:text-black dark:hover:text-white transition">Kids</Link></li>
              <li><Link href="/try-on" className="hover:text-black dark:hover:text-white transition flex items-center gap-2">AI Try-On <span className="text-[10px] bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-full">NEW</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 uppercase tracking-wider text-sm">Help & Info</h4>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400">
              <li><Link href="/help" className="hover:text-black dark:hover:text-white transition">FAQ & Help Center</Link></li>
              <li><Link href="/about" className="hover:text-black dark:hover:text-white transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-black dark:hover:text-white transition">Contact</Link></li>
              <li><Link href="/shipping-returns" className="hover:text-black dark:hover:text-white transition">Shipping & Returns</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-black dark:hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} AURA Fashion. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-black dark:hover:text-white transition">Instagram</Link>
            <Link href="#" className="hover:text-black dark:hover:text-white transition">Twitter</Link>
            <Link href="#" className="hover:text-black dark:hover:text-white transition">TikTok</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
