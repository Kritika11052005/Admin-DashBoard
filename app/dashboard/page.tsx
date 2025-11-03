'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  FileText, 
  Star, 
  TrendingUp, 
  DollarSign,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

// Import components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Sidebar from '@/components/dashboard/Sidebar';
import { KPICard } from '@/components/dashboard/KPICards';
import CountryChart from '@/components/charts/CountryChart';
import CVTrendsChart from '@/components/charts/CVTrendsChart';
import PaidVsFreeChart from '@/components/charts/PaidVsFreeChart';
import CareerStageChart from '@/components/charts/CareerStageChart';
import TopUsersTable from '@/components/charts/TopUsersTable';
import Footer from '@/components/Footer';
import AIInsights from '@/components/dashboard/AIInsights';

interface KPIData {
  totalUsers: number;
  totalAnalyses: number;
  avgCVScore: number;
  totalFeedback: number;
  paidUserPercentage: number;
  userGrowth: number;
}

export default function DashboardPage() {
  const { user } = useAuth(); // Get user from AuthContext
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredView, setFilteredView] = useState(false);
  const [activePage, setActivePage] = useState('overview');

  // Get username from AuthContext
  const userName = user?.name || 'Admin';

  useEffect(() => {
    // Layout already handles auth, just fetch data
    fetchKPIData();
  }, []);

  const fetchKPIData = async () => {
    try {
      const response = await fetch('/api/analytics/kpis');
      const result = await response.json();
      if (result.success) {
        setKpiData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch KPI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredView(query.length > 0);
    console.log('Searching dashboard for:', query);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center transition-colors">
        <div className="text-gray-900 dark:text-white text-xl">Loading dashboard data...</div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Total Users',
      value: kpiData?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      trend: `+${kpiData?.userGrowth || 0}%`,
    },
    {
      title: 'CV Analyses',
      value: kpiData?.totalAnalyses || 0,
      icon: FileText,
      color: 'bg-purple-500',
      trend: 'Total',
    },
    {
      title: 'Avg CV Score',
      value: `${kpiData?.avgCVScore || 0}/100`,
      icon: Star,
      color: 'bg-yellow-500',
      trend: 'Average',
    },
    {
      title: 'Feedback Count',
      value: kpiData?.totalFeedback || 0,
      icon: BarChart3,
      color: 'bg-green-500',
      trend: 'Responses',
    },
    {
      title: 'Paid Users',
      value: `${kpiData?.paidUserPercentage || 0}%`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      trend: 'Conversion',
    },
    {
      title: 'User Growth',
      value: `+${kpiData?.userGrowth || 0}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      trend: 'Last 30 days',
    },
  ];

  const filteredKpiCards = searchQuery
    ? kpiCards.filter(card =>
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    : kpiCards;

  // Render content based on active page
  const renderContent = () => {
    switch (activePage) {
      case 'overview':
        return (
          <>
            {/* Search Results Indicator */}
            {filteredView && (
              <div className="mb-8 p-4 bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-lg max-w-full transition-colors">
                <p className="text-gray-600 dark:text-zinc-400 text-sm">
                  Showing results for: <span className="text-yellow-600 dark:text-yellow-400 font-semibold">&quot;{searchQuery}&quot;</span>
                  {filteredKpiCards.length === 0 && (
                    <span className="ml-2 text-red-500 dark:text-red-400">No results found</span>
                  )}
                </p>
              </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 xl:gap-6 mb-10">
              {filteredKpiCards.map((card, index) => (
                <KPICard key={card.title} {...card} index={index} />
              ))}
            </div>

            {/* AI Insights Section */}
            <div className="mb-8">
              <AIInsights />
            </div>

            {/* Charts */}
            {(!filteredView || searchQuery.toLowerCase().includes('chart') || 
              searchQuery.toLowerCase().includes('analytics') ||
              searchQuery.toLowerCase().includes('country') ||
              searchQuery.toLowerCase().includes('cv') ||
              searchQuery.toLowerCase().includes('user')) && (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                  <div className="min-h-[400px]">
                    <CountryChart />
                  </div>
                  <div className="min-h-[400px]">
                    <CVTrendsChart />
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                  <div className="min-h-[400px]">
                    <PaidVsFreeChart />
                  </div>
                  <div className="min-h-[400px]">
                    <CareerStageChart />
                  </div>
                </div>

                <div className="w-full">
                  <TopUsersTable />
                </div>
              </>
            )}
          </>
        );

      case 'users':
        return (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-8 transition-colors">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Users Management</h2>
            <p className="text-gray-600 dark:text-zinc-400">User management features coming soon...</p>
            <div className="mt-6">
              <TopUsersTable />
            </div>
          </div>
        );

      case 'analyses':
        return (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-8 transition-colors">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">CV Analyses</h2>
            <p className="text-gray-600 dark:text-zinc-400">Analysis details and history coming soon...</p>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
              <CVTrendsChart />
              <CareerStageChart />
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-8 transition-colors">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Feedback</h2>
            <p className="text-gray-600 dark:text-zinc-400">Feedback management features coming soon...</p>
          </div>
        );

      case 'trends':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-8 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Analytics Trends</h2>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CVTrendsChart />
              <CountryChart />
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-8 transition-colors">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Settings</h2>
            <p className="text-gray-600 dark:text-zinc-400">System settings and configurations coming soon...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex transition-colors">
      {/* Sidebar */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader userName={userName} onSearch={handleSearch} />

        <main className="flex-1 w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-8">
          {renderContent()}
        </main>

        <Footer />
      </div>
    </div>
  );
}