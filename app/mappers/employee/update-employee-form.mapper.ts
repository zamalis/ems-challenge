import type { UpdateEmployeeFormSchema } from "~/interfaces";
import { mapBaseEmployeeForm } from "./base-employee-form.mapper";
import { getFormDataField } from "~/utils/form-data/get-form-data-field";

export const mapUpdateEmployeeForm = (
  formData: FormData
): Partial<UpdateEmployeeFormSchema> => {
  const idRaw = getFormDataField(formData, "id");
  const id = idRaw ? parseInt(idRaw) : undefined;

  return {
    ...mapBaseEmployeeForm(formData),
    id,
    photo: getFormDataField(formData, "photo"),
  };
};
