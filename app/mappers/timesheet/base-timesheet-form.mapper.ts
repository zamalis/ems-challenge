import type { BaseTimesheetFormSchema } from "~/interfaces";
import { getFormDataField } from "~/utils";

export const mapBaseTimesheetForm = (
  formData: FormData
): Partial<BaseTimesheetFormSchema> => {
  const startTimeRaw = getFormDataField(formData, "startTime");
  const startTime = startTimeRaw ? new Date(startTimeRaw) : undefined;

  const endTimeRaw = getFormDataField(formData, "endTime");
  const endTime = endTimeRaw ? new Date(endTimeRaw) : undefined;

  const employeeIdRaw = getFormDataField(formData, "employeeId");
  const employeeId = employeeIdRaw ? parseInt(employeeIdRaw) : undefined;

  return {
    startTime,
    endTime,
    employeeId,
    summary: getFormDataField(formData, "summary"),
  };
};
