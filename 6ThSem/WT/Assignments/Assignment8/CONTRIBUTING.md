# Contributing to Course Feedback System

Thank you for your interest in contributing! This document provides guidelines and information for developers.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── FeedbackForm.tsx    # Feedback submission form
│   ├── FeedbackList.tsx    # List of feedback entries
│   └── FeedbackCard.tsx    # Individual feedback card
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
├── types.ts            # TypeScript type definitions
└── index.css           # Global styles (Tailwind CSS)
```

## Development Guidelines

- **Component Structure**: Keep components focused and single-responsibility
- **State Management**: Use React hooks for state management
- **Styling**: Use Tailwind CSS utility classes for styling
- **Type Safety**: Always define TypeScript interfaces for props and state
- **Validation**: Implement client-side validation for forms

## Code Style

- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Use consistent formatting (prettier is recommended)

## Testing

Before committing:
- Verify all form validation works correctly
- Test add/delete functionality
- Check responsive design on different screen sizes
- Ensure localStorage persistence works

## Building

To create a production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## License

MIT
