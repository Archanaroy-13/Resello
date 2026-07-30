import React from 'react';
import { Link } from 'react-router-dom';
import { Store, ShieldCheck, RefreshCw, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-forest-900 text-slate-300 pt-16 pb-12 mt-20 border-t border-forest-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-forest-800 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-forest-800 text-sage-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Verified Listings</h4>
              <p className="text-xs text-slate-400">Authentic pre-owned goods with photo verification</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-forest-800 text-sage-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Sustainable Choice</h4>
              <p className="text-xs text-slate-400">Give quality items a second life & reduce waste</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-forest-800 text-sage-400 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Direct Contact</h4>
              <p className="text-xs text-slate-400">Connect directly with trusted local sellers</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sage-500 flex items-center justify-center text-white">
                <Store className="w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">Resello</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              The modern marketplace for buying and selling second-hand cameras, fashion, books, home decor, and gadgets.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Marketplace</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/explore" className="hover:text-sage-400 transition-colors">Browse All Products</Link>
              </li>
              <li>
                <Link to="/explore?category=Electronics" className="hover:text-sage-400 transition-colors">Electronics & Tech</Link>
              </li>
              <li>
                <Link to="/explore?category=Fashion" className="hover:text-sage-400 transition-colors">Fashion & Apparel</Link>
              </li>
              <li>
                <Link to="/explore?category=Home%20%26%20Living" className="hover:text-sage-400 transition-colors">Home & Living</Link>
              </li>
            </ul>
          </div>

          {/* User Account */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Seller Central</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/create-listing" className="hover:text-sage-400 transition-colors">List an Item</Link>
              </li>
              <li>
                <Link to="/my-listings" className="hover:text-sage-400 transition-colors">Manage My Listings</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-sage-400 transition-colors">Saved Wishlist</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-sage-400 transition-colors">Edit Profile Settings</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Information & Legal</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-sage-400 transition-colors">About Resello</a>
              </li>
              <li>
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-sage-400 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-sage-400 transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-sage-400 transition-colors">Help & Contact Support</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-forest-800 text-center md:flex md:justify-between text-xs text-slate-500">
          <p>© 2026 Resello Inc. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built with modern MERN Stack & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
};
