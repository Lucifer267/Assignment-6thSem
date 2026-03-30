# Quick Start Guide

## Installation

```bash
# Clone and navigate to the project
cd Assignment8

# Install dependencies
npm install
```

## Development

```bash
# Start the development server (port 5173)
npm run dev

# Open browser and navigate to http://localhost:5173
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Check TypeScript for errors

## Troubleshooting

### Port Already in Use
If port 5173 is in use, Vite will automatically use the next available port.

### Dependencies Not Installing
Try clearing package cache:
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Hot Reload Not Working
Check if DISABLE_HMR environment variable is set, and ensure it's not set to 'true'.

## First Time Users

1. Run `npm install`
2. Run `npm run dev`
3. Open the application in your browser
4. Try submitting feedback using the form
5. Test sorting and deletion features

## File Locations

- **Form Component**: `src/components/FeedbackForm.tsx`
- **Components List**: `src/components/FeedbackList.tsx`
- **Styles**: Global Tailwind CSS in `src/index.css`
- **App Configuration**: `vite.config.ts`, `tsconfig.json`

## Need Help?

Refer to:
- `README.md` - Project overview and features
- `ARCHITECTURE.md` - Technical architecture details
- `CONTRIBUTING.md` - Development guidelines
