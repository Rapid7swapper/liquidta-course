// Course types
export interface Course {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Progress types
export interface LessonProgress {
  id: string;
  lessonId: string;
  enrollmentId: string;
  isCompleted: boolean;
  watchedSeconds: number;
  totalSeconds: number;
  completedAt?: Date;
}

// Quiz types
export interface Quiz {
  id: string;
  moduleId: string;
  passingScore: number;
  maxAttempts?: number;
  timeLimitMinutes?: number;
}

// Certificate types
export interface Certificate {
  id: string;
  enrollmentId: string;
  certificateId: string;
  issuedAt: Date;
}

