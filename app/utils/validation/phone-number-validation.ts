import type { ValidationResult } from "~/interfaces";
import { validateString } from "./string-validation";

const isValidPhoneNumber = (value: string) => {
  const re = /^[0-9]+$/;
  return re.test(value);
};

export const validatePhoneNumber = (
  value: string | undefined
): ValidationResult => {
  const field = "Phone Number";
  const stringValidation = validateString(field, value);
  if (!stringValidation.isValid) {
    return stringValidation;
  }

  if (!isValidPhoneNumber(value!)) {
    return { isValid: false, message: `Invalid ${field}` };
  }

  return { isValid: true };
};
