/**
 * Bookmarks Panel Component
 * Displays favorites and recently viewed locations
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  BookmarkPlus,
  Clock,
  Heart,
  X,
  ChevronRight,
  Trash2,
  MapPin,
} from 'lucide-react';
import { useBookmarkStore } from '../../hooks/useBookmarkStore';
import { useTourState } from '../../hooks/useTourState';

export const BookmarksPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'recent'>('bookmarks');
  const {
    bookmarks,
    recentLocations,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearBookmarks,
    clearRecentLocations,
  } = useBookmarkStore();
  const { currentBlockId, currentImageId, manifest, setBlock, setImage } = useTourState();

  // Get current location info
  const getCurrentLocationInfo = () => {
    if (!manifest || !currentBlockId || !currentImageId) return null;
    const block = manifest.blocks.find((b) => b.id === currentBlockId);
    const lab = block?.labs?.find((l) => l.id === currentImageId);
    if (!block || !lab) return null;
    return {
      blockName: block.name || block.label || currentBlockId,
      labName: lab.name || currentImageId,
    };
  };

  const locationInfo = getCurrentLocationInfo();
  const currentIsBookmarked =
    currentBlockId && currentImageId ? isBookmarked(currentBlockId, currentImageId) : false;

  // Toggle bookmark for current location
  const toggleCurrentBookmark = () => {
    if (!currentBlockId || !currentImageId || !locationInfo) return;

    if (currentIsBookmarked) {
      const bookmark = useBookmarkStore
        .getState()
        .bookmarks.find((b) => b.blockId === currentBlockId && b.imageId === currentImageId);
      if (bookmark) removeBookmark(bookmark.id);
    } else {
      addBookmark({
        blockId: currentBlockId,
        imageId: currentImageId,
        name: `${locationInfo.blockName} - ${locationInfo.labName}`,
      });
    }
  };

  // Navigate to a location
  const navigateTo = (blockId: string, imageId: string) => {
    setBlock(blockId);
    setImage(imageId);
    setIsOpen(false);
  };

  // Listen for close events
  useEffect(() => {
    const handleClose = () => setIsOpen(false);
    window.addEventListener('close-all-overlays', handleClose);
    return () => window.removeEventListener('close-all-overlays', handleClose);
  }, []);

  // Format relative time - use state to avoid calling impure function during render
  const [now, setNow] = useState(() => Date.now());

  // Update "now" periodically for relative timestamps
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const formatRelativeTime = useCallback(
    (timestamp: number) => {
      const diff = now - timestamp;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return new Date(timestamp).toLocaleDateString();
    },
    [now]
  );

  return (
    <>
      {/* Bookmark Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={toggleCurrentBookmark}
        className={`fixed top-20 right-6 z-40 p-3 backdrop-blur-md rounded-full border transition-all group ${
          currentIsBookmarked
            ? 'bg-pink-500/20 border-pink-500/50 text-pink-400'
            : 'bg-black/40 border-white/10 text-white/70 hover:text-white hover:bg-black/60'
        }`}
        title={currentIsBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        <Heart
          size={20}
          className={`transition-transform group-hover:scale-110 ${currentIsBookmarked ? 'fill-current' : ''}`}
        />
      </motion.button>

      {/* Bookmarks Panel Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.55 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-32 right-6 z-40 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-all group"
        title="Bookmarks & History"
      >
        <Bookmark size={20} className="group-hover:scale-110 transition-transform" />
        {bookmarks.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-sky-500 rounded-full text-xs text-white flex items-center justify-center">
            {bookmarks.length}
          </span>
        )}
      </motion.button>

      {/* Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-zinc-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-500/20 rounded-lg">
                    <Bookmark size={20} className="text-sky-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Saved Places</h2>
                    <p className="text-xs text-white/50">Your bookmarks & history</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setActiveTab('bookmarks')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'bookmarks'
                      ? 'text-sky-400 border-b-2 border-sky-400'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Heart size={16} />
                  Bookmarks ({bookmarks.length})
                </button>
                <button
                  onClick={() => setActiveTab('recent')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'recent'
                      ? 'text-sky-400 border-b-2 border-sky-400'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Clock size={16} />
                  Recent ({recentLocations.length})
                </button>
              </div>

              {/* Content */}
              <div
                className="flex-1 overflow-y-auto p-4"
                style={{ maxHeight: 'calc(100vh - 180px)' }}
              >
                {activeTab === 'bookmarks' ? (
                  bookmarks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="p-4 bg-white/5 rounded-full mb-4">
                        <BookmarkPlus size={32} className="text-white/30" />
                      </div>
                      <p className="text-white/50 mb-2">No bookmarks yet</p>
                      <p className="text-white/30 text-sm">
                        Tap the heart icon to save your favorite spots
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {bookmarks.map((bookmark) => (
                        <motion.div
                          key={bookmark.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className="group relative flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                          onClick={() => navigateTo(bookmark.blockId, bookmark.imageId)}
                        >
                          <div className="p-2 bg-pink-500/20 rounded-lg">
                            <MapPin size={18} className="text-pink-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{bookmark.name}</p>
                            <p className="text-white/40 text-xs">
                              {formatRelativeTime(bookmark.createdAt)}
                            </p>
                          </div>
                          <ChevronRight
                            size={16}
                            className="text-white/30 group-hover:text-white/60"
                          />

                          {/* Delete button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBookmark(bookmark.id);
                            }}
                            className="absolute right-10 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg text-white/40 hover:text-red-400 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </motion.div>
                      ))}

                      {/* Clear all */}
                      {bookmarks.length > 0 && (
                        <button
                          onClick={clearBookmarks}
                          className="w-full mt-4 py-2 text-sm text-white/40 hover:text-red-400 transition-colors"
                        >
                          Clear all bookmarks
                        </button>
                      )}
                    </div>
                  )
                ) : recentLocations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 bg-white/5 rounded-full mb-4">
                      <Clock size={32} className="text-white/30" />
                    </div>
                    <p className="text-white/50 mb-2">No recent visits</p>
                    <p className="text-white/30 text-sm">Your visited locations will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentLocations.map((location, index) => (
                      <motion.div
                        key={`${location.blockId}-${location.imageId}-${index}`}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                        onClick={() => navigateTo(location.blockId, location.imageId)}
                      >
                        <div className="p-2 bg-sky-500/20 rounded-lg">
                          <Clock size={18} className="text-sky-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{location.name}</p>
                          <p className="text-white/40 text-xs">
                            {formatRelativeTime(location.visitedAt)}
                          </p>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-white/30 group-hover:text-white/60"
                        />
                      </motion.div>
                    ))}

                    {/* Clear all */}
                    {recentLocations.length > 0 && (
                      <button
                        onClick={clearRecentLocations}
                        className="w-full mt-4 py-2 text-sm text-white/40 hover:text-red-400 transition-colors"
                      >
                        Clear history
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BookmarksPanel;
