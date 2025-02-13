import type {
  FormValidationResult,
  UpdateEmployeeFormSchema,
} from "~/interfaces";
import { validateBaseEmployeeForm } from "./base-employee-form.validator";
import { validateNumber } from "~/utils";

export const validateUpdateEmployeeForm = (
  form: Partial<UpdateEmployeeFormSchema>
): FormValidationResult<UpdateEmployeeFormSchema> => {
  const { errors: baseErrors } = validateBaseEmployeeForm(form);

  const errors: Partial<Record<keyof UpdateEmployeeFormSchema, string>> = {
    ...baseErrors,
  };

  const idValidation = validateNumber("Id", form.id);
  if (!idValidation.isValid) {
    errors.id = idValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    data: form as UpdateEmployeeFormSchema,
    errors,
  };
};
