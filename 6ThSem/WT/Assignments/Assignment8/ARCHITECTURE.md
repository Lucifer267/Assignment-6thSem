# Architecture Overview

## Project Description

Course Feedback System is a web application built with React and TypeScript that allows students to submit feedback on courses. The application focuses on simplicity, usability, and data persistence through browser local storage.

## Technology Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Animations**: Motion

## Core Features

### 1. Feedback Collection
- Students submit feedback with their name, email, course name, and rating
- Real-time form validation
- User-friendly error messages

### 2. Feedback Display
- Grid layout for feedback cards
- Sort by latest or highest-rated
- Delete functionality for entries

### 3. Data Persistence
- All feedback stored in browser's localStorage
- UUID generation for unique feedback IDs
- Automatic timestamp recording

## Component Architecture

### App.tsx (Main Component)
- Manages global state for feedback entries and sorting
- Handles localStorage operations
- Coordinates between form and list components

### FeedbackForm.tsx
- Controlled component for feedback submission
- Input validation with error state management
- Form reset after successful submission

### FeedbackList.tsx
- Displays collection of feedback cards
- Sorting functionality
- Empty state handling

### FeedbackCard.tsx
- Individual feedback display
- Delete button for entry removal
- Date formatting and display

## Data Flow

```
User Input → FeedbackForm
         ↓
  Validation
         ↓
  onSubmit Handler (App.tsx)
         ↓
  Add to State
         ↓
  Save to localStorage
         ↓
  Update FeedbackList
         ↓
  Display FeedbackCard
```

## State Management

- **feedbacks**: Array of feedback entries
- **sortOption**: Current sort method ('latest' or 'highest-rated')
- **newFeedbackId**: ID of most recently added feedback for highlighting

## Styling Approach

- Tailwind CSS for responsive design
- Component-level styling best practices
- Consistent color scheme (blue accent for primary actions)
- Mobile-first responsive design

## Performance Considerations

- Memoized sorting operation to prevent unnecessary recalculations
- Efficient state updates
- Minimal re-renders through proper React hook usage

## Future Enhancement Ideas

- Backend API integration for data persistence
- User authentication
- Analytics dashboard
- Export feedback functionality
- Search and filter capabilities
- Attachment support
- Rating analytics
