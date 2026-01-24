# Implementation Plan

## Phase 1: Core Navigation & Map System
- [ ] **Interactive Map Component**:
    - [ ] Create `MapOverlay` component using `svgPath` data from manifest.
    - [ ] Implement current location indicator (dot + radar cone).
    - [ ] Add click handlers to switch Blocks.
- [ ] **Spatial Links (Hotspots)**:
    - [ ] Update data store to handle `links` (node-to-node connections).
    - [ ] Create `Hotspot` 3D component in the Scene.
    - [ ] Implement click-to-move logic.

## Phase 2: Enhanced UI & Information
- [ ] **Point of Interest (POI) System**:
    - [ ] Define POI structure in `manifest.json`.
    - [ ] Create `Html` markers in Three.js scene.
    - [ ] Build `InfoModal` for displaying POI content.
- [ ] **Quick Jump Menu**:
    - [ ] Refactor existing block navigation into a sidebar/drawer.
    - [ ] Add search functionality for rooms/labs.

## Phase 3: Mobile Experience & Polish
- [ ] **Gyroscope Controls**:
    - [ ] Integrate DeviceOrientation API for mobile camera control.
- [ ] **Transitions**:
    - [ ] Add fade-to-black or cross-dissolve effects when switching images.
- [ ] **Loading States**:
    - [ ] Improve progress bar visualization.
    - [ ] Implement smarter pre-loading for adjacent nodes.

## Phase 4: VR & Advanced
- [ ] **VR Support**:
    - [ ] Add VR button to toggle split-screen stereo rendering.
- [ ] **Audio System**:
    - [ ] Add ambient background audio support.
