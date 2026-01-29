/**
 * Analytics Dashboard Component
 * Display analytics data and popular locations
 */

import { useState, useMemo, useSyncExternalStore, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useAnalyticsStore,
  type AnalyticsEvent,
  type LocationStats,
} from '../../hooks/useAnalytics';

// Format duration in human readable format
const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3600000) return `${Math.round(ms / 60000)}m`;
  return `${Math.round(ms / 3600000)}h`;
};

// Format timestamp
const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

interface AnalyticsToggleProps {
  className?: string;
}

export const AnalyticsToggle: React.FC<AnalyticsToggleProps> = ({ className = '' }) => {
  const { analyticsEnabled, setAnalyticsEnabled } = useAnalyticsStore();

  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
      <span className="text-sm text-white/80">Analytics</span>
      <div className="relative">
        <input
          type="checkbox"
          checked={analyticsEnabled}
          onChange={(e) => setAnalyticsEnabled(e.target.checked)}
          className="sr-only peer"
          aria-label="Enable analytics tracking"
        />
        <div className="w-10 h-5 bg-white/20 rounded-full peer peer-checked:bg-green-500/60 transition-colors" />
        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
      </div>
    </label>
  );
};

interface PopularLocationCardProps {
  stat: LocationStats;
  rank: number;
  onClick?: () => void;
}

const PopularLocationCard: React.FC<PopularLocationCardProps> = ({ stat, rank, onClick }) => {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
      aria-label={`Visit ${stat.locationId} in ${stat.blockId}`}
    >
      <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 rounded-full text-white font-bold text-sm">
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{stat.locationId}</p>
        <p className="text-white/60 text-xs truncate">{stat.blockId}</p>
      </div>
      <div className="text-right">
        <p className="text-white font-semibold">{stat.visitCount}</p>
        <p className="text-white/40 text-xs">visits</p>
      </div>
    </motion.button>
  );
};

interface EventLogItemProps {
  event: AnalyticsEvent;
}

const EventLogItem: React.FC<EventLogItemProps> = ({ event }) => {
  const eventIcons: Record<string, string> = {
    page_view: '📄',
    location_visit: '📍',
    hotspot_click: '🎯',
    tour_start: '🚀',
    tour_complete: '✅',
    bookmark_add: '🔖',
    share_click: '📤',
    screenshot_taken: '📸',
    settings_change: '⚙️',
    error: '❌',
  };

  return (
    <div className="flex items-start gap-2 p-2 hover:bg-white/5 rounded text-sm">
      <span className="text-lg" role="img" aria-label={event.type}>
        {eventIcons[event.type] || '📌'}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-white/90 font-medium">{event.type.replace(/_/g, ' ')}</p>
        <p className="text-white/40 text-xs truncate">
          {JSON.stringify(event.data).slice(0, 50)}...
        </p>
      </div>
      <span className="text-white/30 text-xs whitespace-nowrap">
        {new Date(event.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
};

interface AnalyticsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationClick?: (blockId: string, locationId: string) => void;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  isOpen,
  onClose,
  onLocationClick,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'popular' | 'events'>('overview');
  const {
    totalPageViews,
    sessionStartTime,
    getPopularLocations,
    getRecentEvents,
    clearAnalytics,
    analyticsEnabled,
    debugMode,
    setDebugMode,
  } = useAnalyticsStore();

  const popularLocations = useMemo(() => getPopularLocations(10), [getPopularLocations]);
  const recentEvents = useMemo(() => getRecentEvents(50), [getRecentEvents]);

  // Use useSyncExternalStore to track time without calling Date.now() in render
  const subscribeToTime = useCallback((callback: () => void) => {
    const interval = setInterval(callback, 1000);
    return () => clearInterval(interval);
  }, []);
  const getSessionDuration = useCallback(() => Date.now() - sessionStartTime, [sessionStartTime]);
  const sessionDuration = useSyncExternalStore(
    subscribeToTime,
    getSessionDuration,
    getSessionDuration
  );

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: '📊' },
    { id: 'popular' as const, label: 'Popular', icon: '🔥' },
    { id: 'events' as const, label: 'Events', icon: '📋' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl z-50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Analytics Dashboard"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>📈</span>
                Analytics
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close analytics panel"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-white border-b-2 border-blue-500 bg-white/5'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  aria-selected={activeTab === tab.id}
                  role="tab"
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* Status */}
                  <div
                    className={`p-3 rounded-lg ${analyticsEnabled ? 'bg-green-500/20' : 'bg-red-500/20'}`}
                  >
                    <p className="text-sm text-white/80">
                      Analytics:{' '}
                      <span className="font-semibold">
                        {analyticsEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-white/60 text-xs uppercase tracking-wide">Page Views</p>
                      <p className="text-2xl font-bold text-white mt-1">{totalPageViews}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-white/60 text-xs uppercase tracking-wide">Session Time</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {formatDuration(sessionDuration)}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-white/60 text-xs uppercase tracking-wide">
                        Locations Visited
                      </p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {popularLocations.length}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-white/60 text-xs uppercase tracking-wide">Events Logged</p>
                      <p className="text-2xl font-bold text-white mt-1">{recentEvents.length}</p>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="bg-white/5 rounded-xl p-4 space-y-3">
                    <h3 className="text-white font-semibold">Settings</h3>
                    <label className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">Debug Mode</span>
                      <input
                        type="checkbox"
                        checked={debugMode}
                        onChange={(e) => setDebugMode(e.target.checked)}
                        className="w-4 h-4"
                        aria-label="Enable debug mode"
                      />
                    </label>
                    <button
                      onClick={clearAnalytics}
                      className="w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
                    >
                      Clear All Analytics Data
                    </button>
                  </div>

                  {/* Session Info */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">Session Info</h3>
                    <p className="text-white/60 text-xs">Started: {formatTime(sessionStartTime)}</p>
                  </div>
                </div>
              )}

              {activeTab === 'popular' && (
                <div className="space-y-2">
                  {popularLocations.length === 0 ? (
                    <div className="text-center text-white/60 py-8">
                      <p>No location data yet.</p>
                      <p className="text-sm mt-1">Start exploring to see popular locations!</p>
                    </div>
                  ) : (
                    popularLocations.map((stat, index) => (
                      <PopularLocationCard
                        key={`${stat.blockId}:${stat.locationId}`}
                        stat={stat}
                        rank={index + 1}
                        onClick={() => onLocationClick?.(stat.blockId, stat.locationId)}
                      />
                    ))
                  )}
                </div>
              )}

              {activeTab === 'events' && (
                <div className="space-y-1">
                  {recentEvents.length === 0 ? (
                    <div className="text-center text-white/60 py-8">
                      <p>No events recorded yet.</p>
                    </div>
                  ) : (
                    recentEvents.map((event) => <EventLogItem key={event.id} event={event} />)
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface AnalyticsButtonProps {
  onClick: () => void;
  className?: string;
}

export const AnalyticsButton: React.FC<AnalyticsButtonProps> = ({ onClick, className = '' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors ${className}`}
      aria-label="Open analytics dashboard"
      title="Analytics"
    >
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    </motion.button>
  );
};

export default AnalyticsPanel;
