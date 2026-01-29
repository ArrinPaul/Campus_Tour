
# Campus 360° Virtual Tour

A fully-featured, immersive 360° panoramic virtual tour application built with React, Three.js, and modern web technologies. Experience campus locations in stunning detail with interactive navigation, accessibility features, and advanced user engagement tools.

## Key Features

### Core Tour Experience
- **360° Panoramic Views** - Explore campus locations in full spherical panoramas
- **Interactive Hotspots** - Click markers to navigate between locations seamlessly
- **Smart Navigation** - Intuitive controls with minimap, campus map overlay, and breadcrumb navigation
- **Auto-Rotation** - Optional automatic camera rotation for a guided viewing experience
- **Zoom Controls** - Smooth zoom in/out functionality for detailed exploration
- **Device Motion Support** - Gyroscope support for mobile devices

### Navigation & Discovery
- **Full Campus Map** - Grid-based interactive map with quick teleport to any location
- **MiniMap** - Persistent corner minimap showing current position
- **Breadcrumb Trail** - Visual path showing your navigation history
- **Location Search** - Quick search functionality to find specific buildings
- **Guided Tours** - Pre-defined tour routes with automated navigation
- **Bookmarks & Favorites** - Save and revisit your favorite views
- **Recent Visits** - Track and return to recently viewed locations

### Accessibility & Usability
- **High Contrast Mode** - Enhanced visibility for users with visual impairments
- **One-Hand Mode** - Optimized controls for single-handed operation
- **Keyboard Navigation** - Full keyboard shortcut support
- **Screen Reader Support** - ARIA labels and live regions for screen readers
- **Reduced Motion** - Respects user's motion preferences
- **Focus Indicators** - Clear visual focus states for keyboard navigation
- **Audio Descriptions** - Optional audio narration for locations

### Cross-Platform & Responsive
- **Mobile Optimized** - Touch gestures (pinch, swipe, rotate)
- **Progressive Web App (PWA)** - Install as a native-like app
- **Offline Support** - Works without internet after first load
- **Responsive Design** - Adapts to all screen sizes (mobile, tablet, desktop)
- **VR Ready** - WebXR support for immersive VR experiences

### Interactive Features
- **Scavenger Hunt Game** - Gamified campus exploration experience
- **Points of Interest (POI)** - Informational markers with rich media content
- **Photo Mode** - Capture and share screenshots
- **Social Sharing** - Share locations via social media or direct links
- **Deep Linking** - URL-based navigation to specific locations

### Visual Enhancements
- **Time of Day Simulation** - View campus at different times (morning, day, evening, night)
- **Weather Widget** - Live weather information
- **Ambient Audio** - Background soundscapes for immersive experience
- **Custom Cursor** - Enhanced cursor with directional indicators
- **Compass** - Real-time orientation indicator
- **Smooth Transitions** - Fluid animations powered by Framer Motion

### Analytics & Insights
- **Usage Analytics** - Track visitor behavior and popular locations
- **Session Tracking** - Monitor tour sessions and engagement
- **Location Statistics** - View visit counts and average time spent
- **Export Analytics** - Download analytics data as JSON
- **Device Insights** - Track desktop, tablet, and mobile usage

### Advanced Features
- **Admin Panel** - Content management without code changes (Press `Ctrl+Shift+A`)
  - Add/edit/delete custom POIs
  - Manage announcements
  - Location overrides
  - Maintenance mode
- **A/B Testing Panel** - Test different UI variations (Press `Ctrl+Shift+T`)
- **Live Events Calendar** - Showcase upcoming campus events
- **Kiosk Mode** - Ideal for physical installations with attract mode
- **Inactivity Detection** - Auto-reset after period of inactivity

## Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Three.js** - 3D rendering and 360° panorama display
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Framer Motion** - Smooth animations and transitions
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icon library

### Build & Development
- **Vite** - Lightning-fast build tool
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Tailwind CSS** - Utility-first CSS framework

### Testing
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **Playwright** - End-to-end testing
- **Testing Coverage** - Comprehensive test coverage reporting

### Deployment
- **Vercel** - Production hosting platform
- **PWA Support** - Manifest and service worker configuration
- **CDN Optimization** - Fast global content delivery

## Project Structure

```
campus-360-app/
├── src/
│   ├── components/
│   │   ├── Accessibility/     # Accessibility features
│   │   ├── Admin/              # Admin panel & analytics
│   │   ├── Effects/            # Visual effects
│   │   ├── Game/               # Scavenger hunt game
│   │   ├── Kiosk/              # Kiosk mode components
│   │   ├── Layout/             # Layout components
│   │   ├── Live/               # Live data widgets
│   │   ├── UI/                 # UI components
│   │   └── Viewer/             # 360° viewer components
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   ├── assets/                 # Static assets
│   └── App.tsx                 # Main application
├── public/
│   └── exported/               # 360° panoramic images
├── e2e/                        # End-to-end tests
└── tests/                      # Unit tests
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser with WebGL support

### Installation

```bash
# Navigate to project directory
cd campus-360-app

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Testing

```bash
# Run unit tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Arrow Keys` | Rotate camera view |
| `+ / -` | Zoom in/out |
| `M` | Toggle campus map |
| `F` | Toggle fullscreen |
| `H` or `?` | Show help overlay |
| `Esc` | Close overlays |
| `Ctrl+Shift+A` | **Access Admin Panel** (requires password) |
| `Ctrl+Shift+T` | **Open A/B Testing Panel** (admin only) |

## Admin Access

The application includes a powerful admin panel for content management:

**Access:** Press `Ctrl+Shift+A` anywhere in the application
**Default Password:** `admin123` (Change in production!)

### Admin Features:
- **Custom POIs** - Add interactive points with images/videos
- **Announcements** - Display banners and notifications
- **Location Overrides** - Customize location names and descriptions
- **Maintenance Mode** - Enable/disable tour access
- **Data Export/Import** - Backup and restore configurations

## Analytics Dashboard

Track visitor engagement and behavior:
- Total sessions and page views
- Most popular locations
- Average session duration
- Device type distribution
- Export data for further analysis

## Campus Map Order

Locations are displayed in the following sequence:

1. **Entrance** (Main Gate)
2. **Architecture Block**
3. **Block 1**
4. **Block 2**
5. **Block 3**
6. **Block 4**
7. **Block 5**
8. **Block 6**
9. **Devdan**
10. **Outside**

*To modify the order, edit `src/utils/blockOrder.ts`*

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls
```

### Environment Configuration

The application works out-of-the-box with zero configuration. Advanced features can be customized through:
- Admin panel settings
- Environment variables (if needed)
- `vercel.json` configuration

## Configuration

### Adding New Locations

1. Place 360° panoramic images in `public/exported/[LocationName]/`
2. Update the manifest in your data configuration
3. Add thumbnails to `public/exported/thumbnails/`
4. Configure in Admin Panel or update block order

### Customization

- **Theme Colors** - Edit Tailwind configuration
- **Feature Toggles** - Modify feature settings store
- **Analytics** - Configure tracking parameters
- **Accessibility** - Adjust accessibility store settings

## Progressive Web App

The tour can be installed as a native-like app:
- Offline functionality
- Add to home screen
- Full-screen mode
- Fast loading

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation
4. Run linting and tests before committing

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

**Required:** WebGL support for 3D rendering

## Security Notes

- Change default admin password in production
- Implement proper authentication for admin features
- Sanitize user-generated content
- Use HTTPS in production

## Performance

- Lazy loading of panoramic images
- Optimized texture compression
- Efficient state management
- Code splitting and tree shaking
- CDN delivery via Vercel

## Support

For issues, feature requests, or questions:
- Check the help overlay (`H` key)
- Review component documentation
- Contact development team

## License

*Specify your license here*

---

**Built using React, Three.js, and modern web technologies**

*Last Updated: January 2026*


