
export interface SubTask {
  id: number;
  description: string;
  completed: boolean;
}

export interface GeminiSubTask {
    task: string;
}

export interface PlannableValidationResult {
  isPlannable: boolean;
  reason: string;
}
