import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../context/WishlistContext';
import { getMyListings } from '../services/productService';
import { formatDate, formatCurrency } from '../utils/formatters';
import {
  LayoutDashboard,
  Package,
  Heart,
  UserCheck,
  Settings,
  LogOut,
  PlusCircle,
  ShoppingBag,
  Eye,
  TrendingUp,
  CheckCircle,
  Tag,
  AtSign,
  Calendar,
  Edit,
  ArrowRight,
  Sparkles,
  BarChart3,
  Clock
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register Chart.js modules
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

export const DashboardPage = () => {
  const { user, logoutUser } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const showToast = outletContext?.showToast;

  const [activeTab, setActiveTab] = useState('overview');
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getMyListings();
      if (res.success) {
        setMyProducts(res.data || []);
      }
    } catch (err) {
      console.error('[Dashboard Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    if (showToast) showToast('Logged out successfully', 'success');
    navigate('/login');
  };

  // Calculate dynamic stats
  const totalListings = myProducts.length;
  const availableListings = myProducts.filter(p => p.status === 'Available').length;
  const soldListings = myProducts.filter(p => p.status === 'Sold').length;
  const totalViews = myProducts.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalValue = myProducts.reduce((acc, p) => acc + (p.price || 0), 0);

  // Category counts for chart
  const categoriesMap = {};
  myProducts.forEach(p => {
    categoriesMap[p.category] = (categoriesMap[p.category] || 0) + 1;
  });

  // Chart Data: Status Doughnut
  const statusChartData = {
    labels: ['Available Listings', 'Sold Listings'],
    datasets: [
      {
        data: [availableListings || 1, soldListings],
        backgroundColor: ['#87A96B', '#EF4444'],
        hoverBackgroundColor: ['#6B8E50', '#DC2626'],
        borderWidth: 0
      }
    ]
  };

  // Chart Data: Category Distribution Bar
  const categoryLabels = Object.keys(categoriesMap).length > 0 ? Object.keys(categoriesMap) : ['Fashion', 'Electronics', 'Home'];
  const categoryValues = Object.keys(categoriesMap).length > 0 ? Object.values(categoriesMap) : [1, 1, 1];

  const categoryChartData = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Items Uploaded',
        data: categoryValues,
        backgroundColor: '#1E3F1A',
        borderRadius: 8
      }
    ]
  };

  const avatarUrl = user?.profileImage?.url || user?.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
          <img
            src={avatarUrl}
            alt={user?.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-sage-100 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-forest-900">{user?.name}</h1>
              <UserCheck className="w-5 h-5 text-sage-600" />
            </div>
            <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-3 mt-1 font-medium">
              <span className="flex items-center gap-1">
                <AtSign className="w-3.5 h-3.5 text-slate-300" />
                {user?.username}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-300" />
                Member since {formatDate(user?.createdAt)}
              </span>
            </p>
          </div>
        </div>

        {/* Quick Hero Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            to="/create-listing"
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-2xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List New Item</span>
          </Link>
          <Link
            to="/profile"
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Sidebar Nav + Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-soft space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 ${
                activeTab === 'overview'
                  ? 'bg-forest-800 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <Link
              to="/my-listings"
              className="w-full px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>My Listings</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-sage-50 text-sage-700 text-[10px]">
                {totalListings}
              </span>
            </Link>

            <Link
              to="/wishlist"
              className="w-full px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4" />
                <span>Saved Wishlist</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px]">
                {wishlistCount}
              </span>
            </Link>

            <Link
              to="/profile"
              className="w-full px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-3"
            >
              <Settings className="w-4 h-4" />
              <span>Profile & Settings</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all flex items-center gap-3 pt-3 border-t border-slate-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right Column: Dashboard Main Content */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* Statistics Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft space-y-2">
              <div className="w-9 h-9 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-slate-900">{totalListings}</span>
                <span className="text-[11px] text-slate-400 font-medium">Total Listings</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft space-y-2">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-emerald-700">{availableListings}</span>
                <span className="text-[11px] text-slate-400 font-medium">Available Items</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft space-y-2">
              <div className="w-9 h-9 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-red-600">{soldListings}</span>
                <span className="text-[11px] text-slate-400 font-medium">Items Sold</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft space-y-2">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-slate-900">{totalViews}</span>
                <span className="text-[11px] text-slate-400 font-medium">Listing Views</span>
              </div>
            </div>

          </div>

          {/* Analytics Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Status Doughnut Chart */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-sage-600" />
                  <span>Listings by Status</span>
                </h3>
              </div>
              <div className="max-w-xs mx-auto aspect-square py-2">
                <Doughnut data={statusChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
            </div>

            {/* Category Bar Chart */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-forest-800" />
                  <span>Category Distribution</span>
                </h3>
              </div>
              <div className="max-w-full aspect-[4/3] py-2">
                <Bar data={categoryChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
            </div>

          </div>

          {/* Quick Actions Bar */}
          <div className="bg-forest-900 rounded-3xl p-6 text-white flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div>
              <h3 className="font-bold text-base">Quick Marketplace Actions</h3>
              <p className="text-xs text-slate-300">Manage products, browse deals, or edit account</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/create-listing"
                className="px-4 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Listing</span>
              </Link>
              <Link
                to="/explore"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Browse Directory</span>
              </Link>
              <Link
                to="/my-listings"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Manage Listings</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Recent Listings Activity</span>
              </h3>
              <Link to="/my-listings" className="text-xs font-bold text-sage-600 hover:underline">
                View All &rarr;
              </Link>
            </div>

            {myProducts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                You haven't listed any items yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myProducts.slice(0, 4).map(item => (
                  <div key={item._id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                        alt={item.title}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-100"
                      />
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">{item.title}</h4>
                        <p className="text-[11px] text-slate-400">
                          {formatCurrency(item.price)} • {item.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                      }`}>
                        {item.status}
                      </span>
                      <Link
                        to={`/product/${item._id}`}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
