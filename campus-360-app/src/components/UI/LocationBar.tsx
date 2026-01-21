import { useState, useEffect, useRef } from 'react';
import { useTourState } from '../../hooks/useTourState';
import type { Block, Lab } from '../../hooks/useTourDataStore';
import { Image as ImageIcon, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const LocationBar: React.FC = () => {
  const { manifest, currentBlockId, currentImageId, setImage, setIdle } = useTourState();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!manifest || !currentBlockId) return null;

  const currentBlock: Block | undefined = manifest.blocks.find(
    (b: Block) => b.id === currentBlockId
  );
  
  if (!currentBlock?.labs || currentBlock.labs.length <= 1) return null;

  const currentIndex = currentBlock.labs.findIndex((l: Lab) => l.id === currentImageId);

  const handleImageClick = (imageId: string) => {
    setImage(imageId);
    setIsOpen(false);
    setIdle(false);
  };

  return (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group shadow-lg shadow-black/20"
        >
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-bold leading-none mb-1">Perspective</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white/90 leading-none">
                {currentBlock.labs[currentIndex]?.name || `View ${currentIndex + 1}`}
              </span>
              <span className="text-[10px] font-medium text-blue-400 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                {currentIndex + 1} / {currentBlock.labs.length}
              </span>
            </div>
          </div>
          <ChevronDown 
            size={14} 
            className={`ml-1 text-white/30 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-48 p-2 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl"
          >
            <div className="max-h-60 overflow-y-auto scrollbar-hide">
              {currentBlock.labs.map((lab: Lab, index: number) => (
                <button
                  key={lab.id}
                  onClick={() => handleImageClick(lab.id)}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                    currentImageId === lab.id
                      ? 'bg-blue-500/20 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-xs text-white/40 w-5">{index + 1}</span>
                  <span className="truncate">{lab.name || `View ${index + 1}`}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
