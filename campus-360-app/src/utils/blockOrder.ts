/**
 * Block ordering utility
 * Defines the custom order for campus locations
 */

import type { Block } from '../hooks/useTourDataStore';

// Define the desired order of blocks
// Block IDs should match the ones in your manifest
const BLOCK_ORDER = [
  'gatetologo',      // Entrance (Main Gate)
  'archi',           // Architecture block
  'block1',          // Block 1
  'block2',          // Block 2
  'block3',          // Block 3
  'block4',          // Block 4
  'block5',          // Block 5
  'block6',          // Block 6
  'devdan',          // Devadhan
  'outside',         // Outside
  'out',             // Outside (alternate)
];

/**
 * Sort blocks according to the defined order
 * Blocks not in the order list will appear at the end
 */
export function sortBlocks(blocks: Block[]): Block[] {
  return [...blocks].sort((a, b) => {
    const aIndex = BLOCK_ORDER.indexOf(a.id.toLowerCase());
    const bIndex = BLOCK_ORDER.indexOf(b.id.toLowerCase());
    
    // If both blocks are in the order list, sort by their index
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // If only one block is in the order list, it comes first
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    // If neither block is in the order list, sort alphabetically
    const aLabel = (a.name || a.label || a.id).toLowerCase();
    const bLabel = (b.name || b.label || b.id).toLowerCase();
    return aLabel.localeCompare(bLabel);
  });
}
