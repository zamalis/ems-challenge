import type {
  CreateTimesheetFormSchema,
  FormValidationResult,
} from "~/interfaces";
import { validateBaseTimesheetForm } from "./base-timesheet-form.validator";

export const validateCreateETimesheetForm = (
  form: Partial<CreateTimesheetFormSchema>
): FormValidationResult<CreateTimesheetFormSchema> => {
  return validateBaseTimesheetForm(form);
};
