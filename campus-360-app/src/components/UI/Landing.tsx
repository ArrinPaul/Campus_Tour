import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Eye, Sparkles } from 'lucide-react';
import { useTourState } from '../../hooks/useTourState';

export const Landing = () => {
  const { setTourStarted } = useTourState();

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      
      <header className="absolute top-0 left-0 right-0 z-10 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="text-base font-semibold tracking-tight text-white/90">Campus 360</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">About</a>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Locations</a>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white/[0.03] border border-white/[0.06]">
            <Sparkles size={12} className="text-blue-400" />
            <span className="text-xs text-white/50 font-medium">Virtual Campus Experience</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-5">
            Discover Our Campus
            <span className="block text-white/40 mt-1">In Stunning 360°</span>
          </h1>

          <p className="text-base text-white/40 max-w-lg mx-auto mb-10 leading-relaxed">
            Take an immersive virtual tour through our world-class facilities, 
            explore every corner from the comfort of your home.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setTourStarted(true)}
              className="group flex items-center gap-3 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all"
            >
              <span>Start Tour</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            
            <button className="flex items-center gap-2 px-6 py-3 text-white/60 hover:text-white transition-colors">
              <Eye size={16} />
              <span className="text-sm font-medium">Preview</span>
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8"
        >
          <div className="flex items-center gap-2 text-white/30">
            <MapPin size={14} />
            <span className="text-xs">10+ Locations</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-white/30">
            <Eye size={14} />
            <span className="text-xs">360° Views</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="text-xs text-white/30">HD Quality</div>
        </motion.div>
      </div>
    </div>
  );
};
