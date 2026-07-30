import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWishlist } from '../../context/WishlistContext';
import { CATEGORIES } from '../../utils/formatters';
import {
  Store,
  Search,
  Heart,
  PlusCircle,
  User,
  LogOut,
  Package,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-forest-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5 text-sage-400" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-forest-900 group-hover:text-sage-600 transition-colors">
              Resello
            </span>
          </Link>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search pre-owned cameras, jackets, books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          </form>

          {/* Right Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* List an Item CTA */}
            <Link
              to={isAuthenticated ? '/create-listing' : '/login'}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sage-500 hover:bg-sage-600 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-hover hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List an Item</span>
            </Link>

            {/* Wishlist Icon */}
            <Link
              to={isAuthenticated ? '/wishlist' : '/login'}
              className="relative p-2.5 rounded-2xl text-slate-600 hover:text-forest-800 hover:bg-slate-100 transition-colors"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white animate-fadeIn">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth State */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  <img
                    src={user?.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user?.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <span className="text-xs font-semibold text-slate-700 max-w-[90px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-sage-50 hover:text-sage-700 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </Link>

                    <Link
                      to="/my-listings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-sage-50 hover:text-sage-700 transition-colors"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      My Listings
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-sage-50 hover:text-sage-700 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-slate-400" />
                      Saved Wishlist ({wishlistCount})
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-sage-50 hover:text-sage-700 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Edit Profile
                    </Link>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-2xl text-xs font-semibold text-slate-700 hover:text-forest-800 hover:bg-slate-100 transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-2xl text-xs font-semibold bg-forest-800 hover:bg-forest-900 text-white transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Category Pill Bar (Desktop) */}
        <div className="hidden md:flex items-center gap-6 py-2 overflow-x-auto border-t border-slate-100/60 no-scrollbar text-xs font-medium text-slate-600">
          <Link
            to="/explore"
            className={`whitespace-nowrap hover:text-sage-600 transition-colors ${location.pathname === '/explore' ? 'text-sage-600 font-bold' : ''}`}
          >
            All Products
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/explore?category=${encodeURIComponent(cat)}`}
              className="whitespace-nowrap hover:text-sage-600 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-4 animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search marketplace..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </form>

          <div className="flex flex-col space-y-2 pt-2">
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Browse All Products
            </Link>
            <Link
              to={isAuthenticated ? '/create-listing' : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold bg-sage-500 text-white flex items-center gap-2 justify-center"
            >
              <PlusCircle className="w-4 h-4" />
              List an Item
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>User Dashboard</span>
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                </Link>
                <Link
                  to="/my-listings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>My Listings</span>
                  <Package className="w-4 h-4 text-slate-400" />
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Saved Wishlist</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-bold">
                    {wishlistCount}
                  </span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center rounded-xl text-sm font-medium bg-slate-100 text-slate-700"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center rounded-xl text-sm font-medium bg-forest-800 text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
