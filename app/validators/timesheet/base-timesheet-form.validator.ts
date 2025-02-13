import type {
  BaseTimesheetFormSchema,
  FormValidationResult,
} from "~/interfaces";
import { validateDate, validateString } from "~/utils";

export const validateBaseTimesheetForm = (
  form: Partial<BaseTimesheetFormSchema>
): FormValidationResult<BaseTimesheetFormSchema> => {
  const errors: Partial<Record<keyof BaseTimesheetFormSchema, string>> = {};

  const startTimeValidation = validateDate("Start Time", form.startTime);
  if (!startTimeValidation.isValid) {
    errors.startTime = startTimeValidation.message;
  }

  const endTimeValidation = validateDate("End Time", form.endTime);
  if (!endTimeValidation.isValid) {
    errors.endTime = endTimeValidation.message;
  }

  if (startTimeValidation.isValid && endTimeValidation.isValid) {
    const startTime = form.startTime!;
    const endTime = form.endTime!;
    if (startTime >= endTime) {
      errors.startTime = "Start Time should be before End Time";
    }
  }

  const summaryValidation = validateString("Summary", form.summary);
  if (!summaryValidation.isValid) {
    errors.summary = summaryValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    data: form as BaseTimesheetFormSchema,
    errors,
  };
};
