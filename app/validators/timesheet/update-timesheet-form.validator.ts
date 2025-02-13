import type {
  FormValidationResult,
  UpdateTimesheetFormSchema,
} from "~/interfaces";
import { validateBaseTimesheetForm } from "./base-timesheet-form.validator";
import { validateNumber } from "~/utils";

export const validateUpdateTimesheetForm = (
  form: Partial<UpdateTimesheetFormSchema>
): FormValidationResult<UpdateTimesheetFormSchema> => {
  const { errors: baseErrors } = validateBaseTimesheetForm(form);

  const errors: Partial<Record<keyof UpdateTimesheetFormSchema, string>> = {
    ...baseErrors,
  };

  const idValidation = validateNumber("id", form.id);
  if (!idValidation.isValid) {
    errors.id = idValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    data: form as UpdateTimesheetFormSchema,
    errors,
  };
};
