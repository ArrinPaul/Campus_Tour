import { useState } from 'react';
import { Menu, X, MapPin, ChevronDown } from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';
import type { Manifest, Block } from '../../hooks/useTourDataStore';
import { AnimatePresence, motion } from 'framer-motion';

export const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLocationsOpen, setLocationsOpen] = useState(false);
  const { manifest, currentBlockId, setBlock, setIdle } = useTourState();

  const handleLocationClick = (blockId: string) => {
    setBlock(blockId);
    setMobileMenuOpen(false);
    setLocationsOpen(false);
    setIdle(false);
  };

  return (
    <>
      {/* Main Navigation - Minimal & Clean */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <img 
              src="/logo.png" 
              alt="Campus 360" 
              className="w-9 h-9 object-contain"
            />
            <span className="text-lg font-semibold text-white tracking-tight hidden sm:block">
              Campus 360
            </span>
          </motion.div>

          {/* Desktop: Location Selector */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:block relative"
          >
            <button
              onClick={() => setLocationsOpen(!isLocationsOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200"
            >
              <MapPin size={16} className="text-blue-400" />
              <span className="text-sm font-medium text-white/90">
                {manifest?.blocks?.find((b: Block) => b.id === currentBlockId)?.name || 'Select Location'}
              </span>
              <ChevronDown 
                size={14} 
                className={`text-white/50 transition-transform duration-200 ${isLocationsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {isLocationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-2 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl"
                >
                  <div className="max-h-72 overflow-y-auto scrollbar-hide">
                    {manifest?.blocks?.map((block: Block) => (
                      <button
                        key={block.id}
                        onClick={() => handleLocationClick(block.id)}
                        className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                          currentBlockId === block.id
                            ? 'bg-blue-500/20 text-white'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${currentBlockId === block.id ? 'bg-blue-400' : 'bg-white/20'}`} />
                        <span className="text-sm font-medium">{block.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2.5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white"
          >
            <Menu size={20} />
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            
            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-slate-900/98 backdrop-blur-xl z-[101] border-l border-white/10"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <span className="text-lg font-semibold text-white">Locations</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto h-[calc(100%-65px)]">
                {manifest?.blocks?.map((block: Block) => (
                  <button
                    key={block.id}
                    onClick={() => handleLocationClick(block.id)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 transition-all duration-150 ${
                      currentBlockId === block.id
                        ? 'bg-blue-500/20 border border-blue-500/30 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    <MapPin size={18} className={currentBlockId === block.id ? 'text-blue-400' : 'text-white/40'} />
                    <div>
                      <span className="text-sm font-medium block">{block.name}</span>
                      <span className="text-xs text-white/40">{block.labs?.length || 0} views</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
