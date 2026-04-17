export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'sdp' | 'edi' | 'dt' | 'course' | 'achievement';
  technologies?: string[];
  status?: 'completed' | 'in-progress' | 'planned';
}

export interface Badge {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}
