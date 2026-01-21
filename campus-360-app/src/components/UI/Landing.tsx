import { motion } from 'framer-motion';
import { Play, Map, Compass, Shield } from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';

export const Landing = () => {
  const { setTourStarted } = useTourState();

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[25%] -right-[10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-medium tracking-widest uppercase text-blue-200">Experience the Future</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]"
        >
          Explore Our Campus <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            In Immersive 360°
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Step into a virtual journey through our state-of-the-art facilities, 
          iconic landmarks, and vibrant student spaces from anywhere in the world.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button
            onClick={() => setTourStarted(true)}
            className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300 shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.5)] active:scale-95"
          >
            <Play className="fill-current group-hover:scale-110 transition-transform" size={20} />
            <span className="text-lg">Start Virtual Tour</span>
          </button>
          
          <div className="flex items-center gap-8 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex flex-col items-center gap-1">
              <Map size={20} className="text-blue-400" />
              <span className="text-[10px] uppercase tracking-wider text-slate-500">Interactive</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <Compass size={20} className="text-blue-400" />
              <span className="text-[10px] uppercase tracking-wider text-slate-500">360° View</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <Shield size={20} className="text-blue-400" />
              <span className="text-[10px] uppercase tracking-wider text-slate-500">Enterprise</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 text-slate-500 text-sm font-medium tracking-wide"
      >
        Developed with Precision • © 2026 Campus 360
      </motion.div>
    </div>
  );
};
