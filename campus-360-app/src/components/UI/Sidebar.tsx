import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, ChevronRight, Compass, Share2, Check, Gamepad2 } from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';
import { useGameStore } from '../../hooks/useGameStore';
import type { Block } from '../../hooks/useTourDataStore';

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const { manifest, currentBlockId, setBlock, setImage } = useTourState();
  const { isGameActive, setGameActive, resetGame } = useGameStore();

  if (!manifest) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredBlocks = manifest.blocks.filter(
    (block) =>
      (block.name || block.label || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.labs.some((lab) => lab.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBlockClick = (block: Block) => {
    setBlock(block.id);
    if (block.labs && block.labs.length > 0) {
      setImage(block.labs[0].id);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <motion.button
        className="fixed top-20 left-4 z-40 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all shadow-lg"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Compass size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-full sm:w-80 bg-gray-900/95 border-r border-white/10 z-[70] flex flex-col shadow-2xl"
            >
              <div className="p-6 flex justify-between items-center border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Explore Campus</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors relative group"
                    title="Share current view"
                  >
                    {copied ? (
                      <Check size={20} className="text-emerald-400" />
                    ) : (
                      <Share2 size={20} />
                    )}
                    {copied && (
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded whitespace-nowrap">
                        Copied!
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Game Toggle */}
              <div className="px-4 pt-2">
                <button
                  onClick={() => {
                    if (!isGameActive) resetGame();
                    else setGameActive(false);
                    setIsOpen(false);
                  }}
                  className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${
                    isGameActive
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50'
                      : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/50'
                  }`}
                >
                  <Gamepad2 size={20} />
                  {isGameActive ? 'Stop Scavenger Hunt' : 'Start Scavenger Hunt'}
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Blocks List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {filteredBlocks.map((block) => {
                  const isActive = currentBlockId === block.id;
                  return (
                    <button
                      key={block.id}
                      onClick={() => handleBlockClick(block)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all group ${
                        isActive
                          ? 'bg-emerald-500/20 border border-emerald-500/50'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${isActive ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/40 group-hover:text-white'}`}
                      >
                        <MapPin size={20} />
                      </div>
                      <div className="flex-1 text-left">
                        <div
                          className={`font-medium ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`}
                        >
                          {block.name || block.label}
                        </div>
                        <div className="text-xs text-white/30 mt-0.5">
                          {block.labs.length} 360° Views
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`transition-transform ${isActive ? 'text-emerald-400 rotate-90' : 'text-white/20 group-hover:translate-x-1'}`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* CTA at Bottom */}
              <div className="p-6 border-t border-white/10">
                <button
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
                  onClick={() => window.open('https://christuniversity.in/apply-online', '_blank')}
                >
                  Apply Now
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
