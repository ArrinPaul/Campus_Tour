import { useState, useEffect, useRef } from 'react';
import { useTourState } from '../../hooks/useTourState';
import type { Block, Lab } from '../../hooks/useTourDataStore';
import { ChevronDown } from 'lucide-react';
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
    <div
      ref={dropdownRef}
      className="fixed top-3 right-4 md:right-auto md:left-1/2 md:-translate-x-1/2 z-50"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/50 transition-all text-sm"
      >
        <span className="text-white/60">
          {currentBlock.labs[currentIndex]?.name || `View ${currentIndex + 1}`}
        </span>
        <span className="text-[10px] text-white/40 px-1.5 py-0.5 rounded bg-white/10">
          {currentIndex + 1}/{currentBlock.labs.length}
        </span>
        <ChevronDown
          size={14}
          className={`text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 p-1.5 rounded-lg bg-[#141414] border border-white/10 shadow-xl"
          >
            <div className="max-h-48 overflow-y-auto scrollbar-hide">
              {currentBlock.labs.map((lab: Lab, index: number) => (
                <button
                  key={lab.id}
                  onClick={() => handleImageClick(lab.id)}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    currentImageId === lab.id
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] text-white/30 w-4">{index + 1}</span>
                  <span className="truncate">{lab.name || `View ${index + 1}`}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
