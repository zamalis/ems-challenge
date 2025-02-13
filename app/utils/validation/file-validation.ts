import type { ValidationResult } from "~/interfaces";

export const validateFile = (
  field: string,
  value: File | undefined
): ValidationResult => {
  if (value === undefined || value.size === 0) {
    return { isValid: false, message: `${field} required` };
  }

  return { isValid: true };
};
