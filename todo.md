# Project Tasks

## User Experience & Interface
- [x] **Share View Button**: Add a button to the UI that copies the current URL (which already syncs `block` and `view` parameters) to the clipboard.
- [x] **Social Sharing**: Integrate social media share buttons (Facebook, Twitter, LinkedIn) directly into the sidebar.
- [x] **Help/Controls Overlay**: Add a startup overlay or a permanent "Help" button explaining controls (Drag to rotate, Scroll to zoom, Click arrows/hotspots).
- [x] **Loading Optimization**: Implement a smarter pre-loading strategy for "nearby" nodes (linked via hotspots) rather than just linear next/prev.

## Advanced Features
- [x] **Gamification - "Campus Scavenger Hunt"**:
    - [x] Add a global state for "collected items".
    - [x] Place hidden collectibles (e.g., University Mascot icons) in specific scenes.
    - [x] Show a "Trophy" or "Success" modal when all are found.
- [x] **Compass/Orientation UI**: Refine the compass/radar to be always visible or integrated better into the mobile UI.
- [x] **Video Embeds**: Enhance POI modals to support embedding YouTube/Vimeo videos directly.
- [x] **Interactive Map**: Implement a map overlay with "radar" orientation and clickable zones.
- [x] **Lead Generation Form**: Add a "Request Info" form modal in the sidebar.

## Polish & Clean up
- [x] **Asset Placeholder Cleanup**: Verified asset paths.
- [x] **Code Refactoring**: Extract large components (like `ArrowControls`) into smaller sub-components (`TopBar`, `BottomControls`, `NavArrows`).
- [x] **Audio Integration**: Add ambient audio support with toggle controls.

## Future Enhancements (Backlog)
- [ ] **Multi-Image Galleries**: Upgrade POIs to support image carousels instead of single images.
- [ ] **Click-Anywhere Navigation**: Implement depth-map based navigation for unconstrained movement.
- [ ] **Backend Integration**: Connect the lead generation form to a real email service or database.