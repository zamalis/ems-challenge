import type { ValidationResult } from "~/interfaces";
import { validateString } from "./string-validation";

const isValidEmail = (value: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value);
};

export const validateEmail = (value: string | undefined): ValidationResult => {
  const field = "Email";
  const stringValidation = validateString(field, value);
  if (!stringValidation.isValid) {
    return stringValidation;
  }

  if (!isValidEmail(value!)) {
    return { isValid: false, message: `Invalid ${field}` };
  }

  return { isValid: true };
};
