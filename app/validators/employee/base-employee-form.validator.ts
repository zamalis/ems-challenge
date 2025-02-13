import type {
  BaseEmployeeFormSchema,
  FormValidationResult,
} from "~/interfaces";
import {
  validateDate,
  validateDateOfBirth,
  validateEmail,
  validateNumber,
  validatePhoneNumber,
  validateString,
} from "~/utils";

export const validateBaseEmployeeForm = (
  form: Partial<BaseEmployeeFormSchema>
): FormValidationResult<BaseEmployeeFormSchema> => {
  const errors: Partial<Record<keyof BaseEmployeeFormSchema, string>> = {};

  const firstNameValidation = validateString("First Name", form.firstName);
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.message;
  }

  const lastNameValidation = validateString("Last Name", form.lastName);
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.message;
  }

  const emailValidation = validateEmail(form.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }

  const phoneNumberValidation = validatePhoneNumber(form.phoneNumber);
  if (!phoneNumberValidation.isValid) {
    errors.phoneNumber = phoneNumberValidation.message;
  }

  const dateOfBirthValidation = validateDateOfBirth(form.dateOfBirth);
  if (!dateOfBirthValidation.isValid) {
    errors.dateOfBirth = dateOfBirthValidation.message;
  }

  const jobTitleValidation = validateString("Job Title", form.jobTitle);
  if (!jobTitleValidation.isValid) {
    errors.jobTitle = jobTitleValidation.message;
  }

  const departmentValidation = validateString("Department", form.department);
  if (!departmentValidation.isValid) {
    errors.department = departmentValidation.message;
  }

  const salaryValidation = validateNumber("Salary", form.salary);
  if (!salaryValidation.isValid) {
    errors.salary = salaryValidation.message;
  }

  const startContractValidation = validateDate(
    "Start Contract",
    form.startContract
  );
  if (!startContractValidation.isValid) {
    errors.startContract = startContractValidation.message;
  }

  const endContractValidation = validateDate("End Contract", form.endContract);
  if (!endContractValidation.isValid) {
    errors.endContract = endContractValidation.message;
  }

  if (startContractValidation.isValid && endContractValidation.isValid) {
    const startContract = form.startContract!;
    const endContract = form.endContract!;
    if (startContract >= endContract) {
      errors.startContract = "Start Contract should be before End Contract";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    data: form as BaseEmployeeFormSchema,
    errors,
  };
};
