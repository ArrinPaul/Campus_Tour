/**
 * Virtual Scrolling Components
 * Efficient rendering for long location lists
 */

import React, { useState, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, MapPin, Building } from 'lucide-react';
import { useVirtualList, calculateContainerHeight } from '../../hooks/useVirtualList';

interface VirtualItem {
  id: string;
  name: string;
  thumbnail?: string;
  category?: string;
  description?: string;
}

interface VirtualListProps {
  items: VirtualItem[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: VirtualItem, index: number, style: React.CSSProperties) => React.ReactNode;
  overscan?: number;
  className?: string;
  onItemClick?: (item: VirtualItem) => void;
}

// Virtual List Component
export const VirtualList: React.FC<VirtualListProps> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  className = '',
  onItemClick,
}) => {
  const { visibleItems, totalHeight, handleScroll } = useVirtualList(
    items,
    itemHeight,
    containerHeight,
    overscan
  );

  return (
    <div
      className={`overflow-auto relative ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, style }) => (
          <div
            key={item.id}
            style={style}
            onClick={() => onItemClick?.(item)}
            className="cursor-pointer"
          >
            {renderItem(item, index, style)}
          </div>
        ))}
      </div>
    </div>
  );
};

// Default Location Item Renderer
interface LocationItemProps {
  item: VirtualItem;
  isActive?: boolean;
  onClick?: () => void;
}

export const LocationItem: React.FC<LocationItemProps> = ({ item, isActive = false, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01, x: 4 }}
      onClick={onClick}
      className={`flex items-center gap-3 p-3 mx-2 rounded-xl cursor-pointer transition-colors ${
        isActive
          ? 'bg-sky-500/20 border border-sky-500/30'
          : 'bg-white/5 hover:bg-white/10 border border-transparent'
      }`}
    >
      {/* Thumbnail */}
      {item.thumbnail ? (
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={item.thumbnail}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
          <Building size={20} className="text-white/40" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={`font-medium truncate ${isActive ? 'text-sky-400' : 'text-white'}`}>
          {item.name}
        </h4>
        {item.category && <span className="text-xs text-white/50">{item.category}</span>}
      </div>

      {/* Arrow */}
      <ChevronRight
        size={16}
        className={`flex-shrink-0 ${isActive ? 'text-sky-400' : 'text-white/30'}`}
      />
    </motion.div>
  );
};

// Virtual Location List Component
interface VirtualLocationListProps {
  locations: VirtualItem[];
  activeLocationId?: string;
  onLocationSelect: (location: VirtualItem) => void;
  maxHeight?: number;
  searchTerm?: string;
}

export const VirtualLocationList: React.FC<VirtualLocationListProps> = ({
  locations,
  activeLocationId,
  onLocationSelect,
  maxHeight = 400,
  searchTerm = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter locations based on search term
  const filteredLocations = useMemo(() => {
    if (!searchTerm.trim()) return locations;
    const term = searchTerm.toLowerCase();
    return locations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(term) ||
        loc.category?.toLowerCase().includes(term) ||
        loc.description?.toLowerCase().includes(term)
    );
  }, [locations, searchTerm]);

  // Calculate container height directly (no useEffect/setState needed)
  const containerHeight = useMemo(() => {
    return calculateContainerHeight(filteredLocations.length, 70, maxHeight);
  }, [filteredLocations.length, maxHeight]);

  if (filteredLocations.length === 0) {
    return (
      <div className="p-8 text-center text-white/50">
        <MapPin size={32} className="mx-auto mb-2 opacity-50" />
        <p>No locations found</p>
        {searchTerm && <p className="text-sm mt-1">Try a different search term</p>}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-1">
      <VirtualList
        items={filteredLocations}
        itemHeight={70}
        containerHeight={containerHeight}
        overscan={5}
        onItemClick={onLocationSelect}
        renderItem={(item) => (
          <LocationItem
            item={item}
            isActive={item.id === activeLocationId}
            onClick={() => onLocationSelect(item)}
          />
        )}
      />
    </div>
  );
};

// Grouped Virtual List (locations grouped by category)
interface GroupedVirtualListProps {
  locations: VirtualItem[];
  activeLocationId?: string;
  onLocationSelect: (location: VirtualItem) => void;
  maxHeight?: number;
}

export const GroupedVirtualList: React.FC<GroupedVirtualListProps> = ({
  locations,
  activeLocationId,
  onLocationSelect,
  maxHeight = 500,
}) => {
  // Initialize with active location's category expanded
  const getInitialExpandedGroups = useCallback(() => {
    if (activeLocationId) {
      const activeLocation = locations.find((loc) => loc.id === activeLocationId);
      if (activeLocation?.category) {
        return new Set([activeLocation.category]);
      }
    }
    return new Set<string>();
  }, [activeLocationId, locations]);

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(getInitialExpandedGroups);

  // Group locations by category
  const groupedLocations = useMemo(() => {
    const groups = new Map<string, VirtualItem[]>();
    locations.forEach((loc) => {
      const category = loc.category || 'Other';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(loc);
    });
    return groups;
  }, [locations]);

  const toggleGroup = useCallback((category: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  return (
    <div className="overflow-auto space-y-2" style={{ maxHeight }}>
      {Array.from(groupedLocations.entries()).map(([category, items]) => {
        const isExpanded = expandedGroups.has(category);

        return (
          <div key={category} className="space-y-1">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(category)}
              className="w-full flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <span className="text-white/80 font-medium text-sm">{category}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">{items.length}</span>
                <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                  <ChevronRight size={16} className="text-white/40" />
                </motion.div>
              </div>
            </button>

            {/* Group Items */}
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1 overflow-hidden"
              >
                {items.map((item) => (
                  <LocationItem
                    key={item.id}
                    item={item}
                    isActive={item.id === activeLocationId}
                    onClick={() => onLocationSelect(item)}
                  />
                ))}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VirtualList;
