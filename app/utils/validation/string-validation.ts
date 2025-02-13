import type { ValidationResult } from "~/interfaces";

export const validateString = (
  field: string,
  value: string | undefined
): ValidationResult => {
  if (value === undefined || value.trim() === "") {
    return { isValid: false, message: `${field} required` };
  }

  return { isValid: true };
};
