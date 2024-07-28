export interface FER {
  matrix: number[][];
  class_wise_frame_count: {
    sad: number;
    fear: number;
    angry: number;
    happy: number;
    disgust: number;
    neutral: number;
    surprised: number;
  };
}

export interface EyeTracking {
  duration?: number;
  total_blinks: number;
  average_blink_duration: number;
}

export interface Analytics {
  fer: FER;
  speech: Record<string, string>;
  eye_tracking: EyeTracking;
}

export interface CSV {
  fer: Record<string, unknown>[];
  speech: Record<string, unknown>[];
  eye_tracking: Record<string, unknown>[];
}
