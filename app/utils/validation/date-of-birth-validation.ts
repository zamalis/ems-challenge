import type { ValidationResult } from "~/interfaces";
import { validateDate } from "./date-validation";

const calculateAge = (dateOfBirth: Date): number => {
  const ageDiffMs = Date.now() - dateOfBirth.getTime();
  const ageDate = new Date(ageDiffMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const validateDateOfBirth = (
  value: Date | undefined
): ValidationResult => {
  const field = "Date Of Birth";
  const dateValidation = validateDate(field, value);
  if (!dateValidation.isValid) {
    return dateValidation;
  }

  if (calculateAge(value!) < 18) {
    return {
      isValid: false,
      message: "Employee should be atleast 18 years old",
    };
  }

  return { isValid: true };
};
