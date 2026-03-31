export interface Feedback {
  id: string;
  studentName: string;
  email: string;
  degreeProgram: string;
  courseName: string;
  professorName: string;
  rating: number;
  feedbackText: string;
  timestamp: number;
}

export type SortOption = 'latest' | 'highest-rated';
