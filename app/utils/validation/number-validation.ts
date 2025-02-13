import type { ValidationResult } from "~/interfaces";

export const validateNumber = (
  field: string,
  value: number | undefined
): ValidationResult => {
  if (value === undefined) {
    return { isValid: false, message: `${field} required` };
  } else if (isNaN(value)) {
    return { isValid: false, message: `Invalid ${field}` };
  } else if (value < 0) {
    return { isValid: false, message: `${field} can't be negative` };
  }

  return { isValid: true };
};
