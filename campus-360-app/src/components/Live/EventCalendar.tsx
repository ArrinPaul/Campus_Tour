/**
 * Event Calendar Components
 * Shows event markers and upcoming events list
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEventsStore } from '../../hooks/useEventsStore';
import type { CampusEvent } from '../../hooks/useEventsStore';
import { Calendar, Clock, MapPin, Users, ExternalLink, X } from 'lucide-react';

// Event Marker - Shows on specific locations
export const EventMarker: React.FC<{ locationId: string }> = ({ locationId }) => {
  const events = useEventsStore((state) => state.getEventsByLocation(locationId));
  const [showDetails, setShowDetails] = useState(false);

  if (events.length === 0) return null;

  const activeEvent = events.find((e) => e.isActive);
  const nextEvent = events.find((e) => e.isUpcoming && !e.isActive);
  const displayEvent = activeEvent || nextEvent;

  if (!displayEvent) return null;

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-4 right-4 cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <motion.div
          className={`relative px-4 py-2 rounded-full backdrop-blur-md shadow-lg border ${
            displayEvent.isActive
              ? 'bg-green-500/90 border-green-300/50'
              : 'bg-blue-500/90 border-blue-300/50'
          }`}
          animate={{
            scale: displayEvent.isActive ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: displayEvent.isActive ? Infinity : 0,
          }}
        >
          <div className="flex items-center gap-2 text-white text-sm font-semibold">
            <Calendar className="w-4 h-4" />
            <span>{displayEvent.isActive ? 'LIVE NOW' : 'UPCOMING'}</span>
            {events.length > 1 && (
              <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs">
                +{events.length - 1}
              </span>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {showDetails && <EventDetailsModal events={events} onClose={() => setShowDetails(false)} />}
      </AnimatePresence>
    </>
  );
};

// Event Details Modal
const EventDetailsModal: React.FC<{
  events: CampusEvent[];
  onClose: () => void;
}> = ({ events, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Events at this Location</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Event Card
const EventCard: React.FC<{ event: CampusEvent }> = ({ event }) => {
  const getCategoryColor = (category: CampusEvent['category']) => {
    const colors = {
      academic: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      cultural: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
      sports: 'bg-green-500/20 text-green-300 border-green-500/50',
      workshop: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
      seminar: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
      other: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
    };
    return colors[category];
  };

  return (
    <div className="bg-slate-700/50 rounded-xl p-4 border border-white/10">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-bold text-white">{event.title}</h3>
        {event.isActive && (
          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-semibold animate-pulse">
            LIVE
          </span>
        )}
      </div>

      <p className="text-white/70 text-sm mb-3">{event.description}</p>

      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
        <div className="flex items-center gap-2 text-white/80">
          <Clock className="w-4 h-4" />
          <span>
            {event.startTime} - {event.endTime}
          </span>
        </div>
        <div className="flex items-center gap-2 text-white/80">
          <MapPin className="w-4 h-4" />
          <span>{event.locationName}</span>
        </div>
        {event.organizer && (
          <div className="flex items-center gap-2 text-white/80">
            <Users className="w-4 h-4" />
            <span>{event.organizer}</span>
          </div>
        )}
        <div>
          <span
            className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(event.category)}`}
          >
            {event.category.toUpperCase()}
          </span>
        </div>
      </div>

      {event.registrationLink && (
        <a
          href={event.registrationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          <span>Register Now</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
};

// Upcoming Events List Widget
export const UpcomingEventsWidget: React.FC = () => {
  const { events, loadMockEvents, getUpcomingEvents } = useEventsStore();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load mock events on mount
    if (events.length === 0) {
      loadMockEvents();
    }
  }, [events.length, loadMockEvents]);

  const upcomingEvents = getUpcomingEvents().slice(0, 3);

  if (upcomingEvents.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-20 right-4 z-30"
    >
      <motion.div
        className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 overflow-hidden"
        animate={{
          width: isExpanded ? '320px' : '60px',
        }}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Calendar className="w-6 h-6 text-white" />
          {isExpanded && <span className="ml-2 text-white font-semibold">Upcoming Events</span>}
        </button>

        {/* Events List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10"
            >
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-slate-700/50 rounded-lg border border-white/5"
                  >
                    <h4 className="text-white font-semibold text-sm mb-1">{event.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Clock className="w-3 h-3" />
                      <span>{event.startTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{event.locationName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
