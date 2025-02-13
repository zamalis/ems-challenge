import type {
  CreateEmployeeFormSchema,
  FormValidationResult,
} from "~/interfaces";
import { validateBaseEmployeeForm } from "./base-employee-form.validator";
import { validateFile } from "~/utils";

export const validateCreateEmployeeForm = (
  form: Partial<CreateEmployeeFormSchema>
): FormValidationResult<CreateEmployeeFormSchema> => {
  const { errors: baseErrors } = validateBaseEmployeeForm(form);

  const errors: Partial<Record<keyof CreateEmployeeFormSchema, string>> = {
    ...baseErrors,
  };

  const photoValidation = validateFile("Photo", form.photo);
  if (!photoValidation.isValid) {
    errors.photo = photoValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    data: form as CreateEmployeeFormSchema,
    errors,
  };
};
