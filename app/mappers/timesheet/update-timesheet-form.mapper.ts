import type { UpdateTimesheetFormSchema } from "~/interfaces";
import { getFormDataField } from "~/utils";
import { mapBaseTimesheetForm } from "./base-timesheet-form.mapper";

export const mapUpdateTimesheetForm = (
  formData: FormData
): Partial<UpdateTimesheetFormSchema> => {
  const idRaw = getFormDataField(formData, "id");
  const id = idRaw ? parseInt(idRaw) : undefined;

  return {
    ...mapBaseTimesheetForm(formData),
    id,
  };
};
