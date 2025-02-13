import type { CreateEmployeeFormSchema } from "~/interfaces";
import { mapBaseEmployeeForm } from "./base-employee-form.mapper";
import { getFormDataField } from "~/utils";

export const mapCreateEmployeeForm = (
  formData: FormData
): Partial<CreateEmployeeFormSchema> => {
  return {
    ...mapBaseEmployeeForm(formData),
    photo: getFormDataField(formData, "photo"),
  };
};
