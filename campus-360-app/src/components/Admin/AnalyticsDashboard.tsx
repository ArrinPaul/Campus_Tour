/**
 * Analytics Dashboard Component
 * Displays usage statistics and popular locations
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalyticsStore } from '../../hooks/useAnalyticsStore';
import {
  BarChart3,
  TrendingUp,
  Clock,
  MapPin,
  Users,
  Eye,
  X,
  Trash2,
  Download,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { getTopLocations, getRecentSessions, getTotalStats, clearAnalytics } = useAnalyticsStore();

  const [showConfirm, setShowConfirm] = useState(false);

  const stats = getTotalStats();
  const topLocations = getTopLocations(5);
  const recentSessions = getRecentSessions(5);

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const handleClearData = () => {
    clearAnalytics();
    setShowConfirm(false);
  };

  const handleExportData = () => {
    const data = {
      stats,
      topLocations,
      recentSessions,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus-tour-analytics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h2>
            <p className="text-white/60">Track visitor behavior and popular locations</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportData}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              title="Export Data"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              title="Clear All Data"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Sessions"
            value={stats.totalSessions.toString()}
            color="blue"
          />
          <StatCard
            icon={<Eye className="w-6 h-6" />}
            label="Total Views"
            value={stats.totalViews.toString()}
            color="green"
          />
          <StatCard
            icon={<MapPin className="w-6 h-6" />}
            label="Locations Visited"
            value={stats.totalLocations.toString()}
            color="purple"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="Avg Session"
            value={formatDuration(Math.floor(stats.avgDuration))}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Locations */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">Most Popular Locations</h3>
            </div>

            {topLocations.length > 0 ? (
              <div className="space-y-3">
                {topLocations.map((location, idx) => (
                  <div
                    key={location.locationId}
                    className="flex items-center gap-3 bg-slate-700/30 rounded-lg p-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">{location.locationName}</p>
                      <p className="text-white/60 text-sm">
                        {location.visitCount} visits • Avg{' '}
                        {formatDuration(Math.floor(location.avgTimeSpent))}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="h-2 bg-slate-600 rounded-full w-20">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          style={{
                            width: `${Math.min((location.visitCount / topLocations[0].visitCount) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-center py-8">No data available yet</p>
            )}
          </div>

          {/* Recent Sessions */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Recent Sessions</h3>
            </div>

            {recentSessions.length > 0 ? (
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div key={session.id} className="bg-slate-700/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 text-xs">
                        {new Date(session.startTime).toLocaleString()}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          session.device === 'mobile'
                            ? 'bg-blue-500/20 text-blue-300'
                            : session.device === 'tablet'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-green-500/20 text-green-300'
                        }`}
                      >
                        {session.device}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-white/80">{session.locationsVisited} locations</span>
                      {session.duration && (
                        <span className="text-white/80">{formatDuration(session.duration)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-center py-8">No sessions recorded yet</p>
            )}
          </div>
        </div>

        {/* Confirm Clear Dialog */}
        <AnimatePresence>
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-slate-800 rounded-xl p-6 max-w-md border border-red-500/50"
              >
                <h3 className="text-xl font-bold text-white mb-2">Clear All Analytics?</h3>
                <p className="text-white/60 mb-6">
                  This will permanently delete all analytics data. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleClearData}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Clear Data
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}> = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} mb-2`}>
        {icon}
      </div>
      <p className="text-white/60 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
};

// Analytics Toggle Button (for showing/hiding dashboard)
export const AnalyticsButton: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowDashboard(true)}
        className="fixed bottom-24 right-4 z-30 p-3 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-lg transition-all transform hover:scale-110"
        title="View Analytics"
      >
        <BarChart3 className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {showDashboard && <AnalyticsDashboard onClose={() => setShowDashboard(false)} />}
      </AnimatePresence>
    </>
  );
};
