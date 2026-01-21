import { useProgress } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';

export const Loader = () => {
  const { active, progress } = useProgress();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-[#0a0a0a] flex items-center justify-center"
        >
          <div className="text-center">
            <div className="w-40 mx-auto">
              <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <p className="text-white/30 text-xs mt-3">{Math.round(progress)}%</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
