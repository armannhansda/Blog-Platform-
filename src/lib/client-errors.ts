"use client";

import { TRPCClientError } from "@trpc/client";
import { toast } from "react-hot-toast";

import { errorTypes } from "./errors";
import type { ErrorType, ValidationError } from "./errors";

/**
 * Parses a tRPC error and extracts the error type, message, and validation errors
 */
export function parseTRPCError(error: unknown): {
  type: ErrorType;
  message: string;
  validationErrors?: ValidationError[];
} {
  if (error instanceof TRPCClientError) {
    // Extract the data from the tRPC error
    const errorData = error.data as {
      type?: ErrorType;
      message?: string;
      validationErrors?: ValidationError[];
    };

    return {
      type: errorData?.type || errorTypes.INTERNAL_SERVER_ERROR,
      message: errorData?.message || error.message || "An unexpected error occurred",
      validationErrors: errorData?.validationErrors,
    };
  }

  // Fallback for non-tRPC errors
  return {
    type: errorTypes.INTERNAL_SERVER_ERROR,
    message: error instanceof Error ? error.message : "An unexpected error occurred",
  };
}

/**
 * Shows a toast notification for an error
 */
export function showErrorToast(error: unknown): void {
  const { message, type } = parseTRPCError(error);
  
  let toastMessage = message;
  
  // Customize message based on error type
  if (type === errorTypes.VALIDATION_ERROR) {
    toastMessage = "Please check the form for errors";
  } else if (type === errorTypes.UNAUTHORIZED) {
    toastMessage = "You must be logged in to perform this action";
  } else if (type === errorTypes.FORBIDDEN) {
    toastMessage = "You don't have permission to perform this action";
  }
  
  toast.error(toastMessage);
}

/**
 * Formats field-specific validation errors into a record for form libraries
 */
export function formatValidationErrors(errors?: ValidationError[]): Record<string, string> {
  if (!errors) {
    return {};
  }
  
  return errors.reduce((acc, { field, message }) => {
    acc[field] = message;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Handles a tRPC error in a form context, returns validation errors
 */
export function handleFormError(
  error: unknown,
  options: { showToast?: boolean } = {}
): Record<string, string> {
  const { showToast = true } = options;
  const parsedError = parseTRPCError(error);
  
  if (showToast) {
    showErrorToast(error);
  }
  
  return formatValidationErrors(parsedError.validationErrors);
}

/**
 * Hook for handling errors in React components
 */
export function useErrorHandler() {
  return {
    showError: showErrorToast,
    handleFormError,
    parseError: parseTRPCError,
  };
}