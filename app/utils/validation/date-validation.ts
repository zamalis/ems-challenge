import type { ValidationResult } from "~/interfaces";

const isValidDate = (d: Date): boolean => {
  return d instanceof Date && !isNaN(d.getTime());
};

export const validateDate = (
  field: string,
  value: Date | undefined
): ValidationResult => {
  if (value === undefined) {
    return { isValid: false, message: `${field} required` };
  } else if (!isValidDate(value)) {
    return { isValid: false, message: `Invalid ${field}` };
  }

  return { isValid: true };
};
