# Remaining Tasks

## User Experience & Interface
- [ ] **Share View Button**: Add a button to the UI that copies the current URL (which already syncs `block` and `view` parameters) to the clipboard.
- [ ] **Help/Controls Overlay**: Add a startup overlay or a permanent "Help" button explaining controls (Drag to rotate, Scroll to zoom, Click arrows/hotspots).
- [ ] **Loading Optimization**: Implement a smarter pre-loading strategy for "nearby" nodes (linked via hotspots) rather than just linear next/prev.

## Advanced Features
- [ ] **Gamification - "Campus Scavenger Hunt"**:
    - [ ] Add a global state for "collected items".
    - [ ] Place hidden collectibles (e.g., University Mascot icons) in specific scenes.
    - [ ] Show a "Trophy" or "Success" modal when all are found.
- [ ] **Compass/Orientation UI**: Refine the compass/radar to be always visible or integrated better into the mobile UI.

## Polish & Clean up
- [ ] **Asset Placeholder Cleanup**: Ensure no broken image links if placeholders are used.
- [ ] **Code Refactoring**: Extract large components (like `ArrowControls`) into smaller sub-components if they have grown too large.