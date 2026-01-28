import { useState, useRef, useEffect } from 'react';
import { Menu, X, MapPin, ChevronDown } from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';
import type { Block } from '../../hooks/useTourDataStore';
import { AnimatePresence, motion } from 'framer-motion';

export const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLocationsOpen, setLocationsOpen] = useState(false);
  const { manifest, currentBlockId, setBlock, setIdle } = useTourState();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLocationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationClick = (blockId: string) => {
    setBlock(blockId);
    setMobileMenuOpen(false);
    setLocationsOpen(false);
    setIdle(false);
  };

  const currentBlockName =
    manifest?.blocks?.find((b: Block) => b.id === currentBlockId)?.name || 'Select';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-sm font-semibold text-white/80">Campus 360</span>

          <div ref={dropdownRef} className="hidden md:block relative">
            <button
              onClick={() => setLocationsOpen(!isLocationsOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm"
            >
              <MapPin size={14} className="text-white/40" />
              <span className="text-white/80 font-medium">{currentBlockName}</span>
              <ChevronDown
                size={14}
                className={`text-white/40 transition-transform ${isLocationsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {isLocationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-52 p-1.5 rounded-lg bg-[#141414] border border-white/10 shadow-xl"
                >
                  {manifest?.blocks?.map((block: Block) => (
                    <button
                      key={block.id}
                      onClick={() => handleLocationClick(block.id)}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                        currentBlockId === block.id
                          ? 'bg-white/10 text-white'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${currentBlockId === block.id ? 'bg-sky-400' : 'bg-white/20'}`}
                      />
                      {block.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white/60"
          >
            <Menu size={18} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-72 bg-[#0f0f0f] z-[101] border-l border-white/10"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <span className="text-sm font-semibold text-white">Locations</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-md hover:bg-white/10 text-white/60"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-3">
                {manifest?.blocks?.map((block: Block) => (
                  <button
                    key={block.id}
                    onClick={() => handleLocationClick(block.id)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg mb-1 text-sm transition-colors ${
                      currentBlockId === block.id
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <MapPin
                      size={16}
                      className={currentBlockId === block.id ? 'text-sky-400' : 'text-white/30'}
                    />
                    {block.name}
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
