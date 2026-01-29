import React, { useMemo } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTourState } from '../../hooks/useTourState';

export const Breadcrumb: React.FC = () => {
  const { manifest, currentBlockId, currentImageId, setBlock, setImage, history } = useTourState();

  const breadcrumbItems = useMemo(() => {
    if (!manifest || !currentBlockId) return [];

    const items: {
      id: string;
      label: string;
      type: 'home' | 'block' | 'view';
      onClick: () => void;
    }[] = [];

    // Home/Entrance
    const entranceBlock = manifest.blocks.find(
      (b) => b.id === 'gatetologo' || b.name?.toLowerCase() === 'entrance'
    );
    if (entranceBlock) {
      items.push({
        id: 'home',
        label: 'Home',
        type: 'home',
        onClick: () => {
          setBlock(entranceBlock.id);
          if (entranceBlock.labs?.[0]) {
            setImage(entranceBlock.labs[0].id);
          }
        },
      });
    }

    // Current Block (if not entrance)
    const currentBlock = manifest.blocks.find((b) => b.id === currentBlockId);
    if (currentBlock && currentBlock.id !== entranceBlock?.id) {
      items.push({
        id: currentBlock.id,
        label: currentBlock.name || currentBlock.label || currentBlock.id,
        type: 'block',
        onClick: () => {
          setBlock(currentBlock.id);
          if (currentBlock.labs?.[0]) {
            setImage(currentBlock.labs[0].id);
          }
        },
      });
    }

    // Current View (if has name and multiple views in block)
    const currentView = currentBlock?.labs?.find((l) => l.id === currentImageId);
    if (currentView && currentBlock && currentBlock.labs && currentBlock.labs.length > 1) {
      items.push({
        id: currentView.id,
        label: currentView.name || `View ${currentBlock.labs.indexOf(currentView) + 1}`,
        type: 'view',
        onClick: () => {}, // Current view - no action
      });
    }

    return items;
  }, [manifest, currentBlockId, currentImageId, setBlock, setImage]);

  // Show recent history for quick back-navigation
  let recentHistory: { id: string; blockId: string; label: string }[] = [];
  if (manifest && history.length >= 2) {
    const previousId = history[1];
    if (previousId && previousId !== currentImageId) {
      for (const block of manifest.blocks) {
        const lab = block.labs?.find((l) => l.id === previousId);
        if (lab) {
          recentHistory = [
            {
              id: previousId,
              blockId: block.id,
              label: lab.name || `${block.name || block.label || block.id}`,
            },
          ];
          break;
        }
      }
    }
  }

  if (breadcrumbItems.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="fixed top-20 left-6 z-30"
    >
      <div className="flex items-center gap-1 px-3 py-2 bg-black/30 backdrop-blur-md rounded-lg border border-white/10">
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <ChevronRight size={14} className="text-white/30 mx-1" />}
            <button
              onClick={item.onClick}
              disabled={index === breadcrumbItems.length - 1}
              className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all text-sm ${
                index === breadcrumbItems.length - 1
                  ? 'text-white font-medium cursor-default'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.type === 'home' && <Home size={14} className="text-sky-400" />}
              <span className="max-w-[120px] truncate">{item.label}</span>
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Quick back button */}
      {recentHistory.length > 0 && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => {
            const prev = recentHistory[0];
            setBlock(prev.blockId);
            setImage(prev.id);
          }}
          className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-lg border border-white/5 text-white/50 hover:text-white hover:bg-black/30 transition-all text-xs"
        >
          <ChevronRight size={12} className="rotate-180" />
          <span>Back to {recentHistory[0].label}</span>
        </motion.button>
      )}
    </motion.div>
  );
};
