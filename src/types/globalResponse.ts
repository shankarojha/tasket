export interface GlobalResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string | null;
  }