export interface DominoItem {
  id: string;
  content: string;
  correctIndex: number; // 0-9
  isLocked: boolean;
}

export interface Attempt {
  attemptNumber: number;
  score: number;
  hintsUsed: number;
  timestamp: Date;
}

export interface AppState {
  items: DominoItem[];
  attempts: Attempt[];
  isComplete: boolean;
  hintsUsed: number;
  showFeedback: boolean;
}