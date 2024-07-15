export interface BasicResponse {
  message: string;
}

export type ServerActionResponse = {
  message?: string;
  errors?: Record<string, string[] | undefined>;
  error?: string;
  success?: boolean;
} | null;
