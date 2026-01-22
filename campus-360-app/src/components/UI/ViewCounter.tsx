import { motion } from 'framer-motion';
import { useTourState } from '../../hooks/useTourState';
import type { Block, Lab } from '../../hooks/useTourDataStore';

export const ViewCounter: React.FC = () => {
  const { manifest, currentBlockId, currentImageId } = useTourState();

  if (!manifest || !currentBlockId || !currentImageId) return null;

  const currentBlock: Block | undefined = manifest.blocks.find(
    (b: Block) => b.id === currentBlockId
  );
  if (!currentBlock?.labs) return null;

  const currentIndex = currentBlock.labs.findIndex((l: Lab) => l.id === currentImageId);
  const totalViews = currentBlock.labs.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed bottom-6 right-6 z-30"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/[0.08]">
        <span className="text-xs text-white/50 font-medium">View</span>
        <span className="text-sm text-white font-semibold tabular-nums">
          {currentIndex + 1} / {totalViews}
        </span>
      </div>
    </motion.div>
  );
};
