import type { CreateTimesheetFormSchema } from "~/interfaces";
import { mapBaseTimesheetForm } from "./base-timesheet-form.mapper";

export const mapCreateTimesheetForm = (
  formData: FormData
): Partial<CreateTimesheetFormSchema> => {
  return mapBaseTimesheetForm(formData);
};
