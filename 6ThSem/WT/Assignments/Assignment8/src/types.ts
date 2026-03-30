export interface Feedback {
  id: string;
  studentName: string;
  email: string;
  courseName: string;
  rating: number;
  feedbackText: string;
  timestamp: number;
}

export type SortOption = 'latest' | 'highest-rated';
