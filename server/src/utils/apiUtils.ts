export const createSuccessResponse = <T = unknown>(
  data: T,
  message?: string,
  meta?: {
    limit?: number;
    hasMore?: boolean;
    nextCursor?: string;
  }
): ApiResponse<T> => {
  return {
    success: true,
    data,
    message,
    meta: meta ?? {},
  };
};

export const createErrorResponse = <T = unknown>(
  message: string,
  code: string,
  details?: unknown
): ApiResponse<T> => {
  return {
    success: false,
    message,
    code,
    details,
  };
};
