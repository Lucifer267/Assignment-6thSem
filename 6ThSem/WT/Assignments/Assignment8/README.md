# Course Feedback System

A simple and intuitive web application for collecting, managing, and organizing student feedback on courses. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Add Feedback**: Submit detailed course feedback with ratings
- **View Feedback**: Browse all submitted feedback entries
- **Sort Options**: Sort by latest or highest-rated feedback
- **Delete Entries**: Remove feedback entries as needed
- **Local Storage**: All feedback is stored locally in the browser
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

## Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

## Build for Production

1. Build the project:
   ```bash
   npm run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
├── types.ts             # TypeScript type definitions
├── index.css            # Global styles
└── components/
    ├── FeedbackForm.tsx # Form component for submitting feedback
    ├── FeedbackList.tsx # List display component
    └── FeedbackCard.tsx # Individual feedback card component
```

## How to Use

1. Fill out the feedback form with your information:
   - Student Name (minimum 3 characters)
   - Email (valid email format)
   - Course Name
   - Rating (1-5 stars)
   - Feedback Text (minimum 10 characters)

2. Click "Submit Feedback" to add your feedback

3. View all feedback entries in the list below the form

4. Use the sort dropdown to organize feedback by "Latest First" or "Highest Rated"

5. Click the trash icon to delete any feedback entry

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icon library
- **Motion** - Animation library

## License

MIT
