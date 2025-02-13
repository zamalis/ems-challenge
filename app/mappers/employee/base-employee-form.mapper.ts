import type { BaseEmployeeFormSchema } from "~/interfaces";
import { getFormDataField } from "~/utils/form-data/get-form-data-field";

export const mapBaseEmployeeForm = (
  formData: FormData
): Partial<BaseEmployeeFormSchema> => {
  const dateOfBirthRaw = getFormDataField(formData, "dateOfBirth");
  const dateOfBirth = dateOfBirthRaw ? new Date(dateOfBirthRaw) : undefined;

  const salaryRaw = getFormDataField(formData, "salary");
  const salary = salaryRaw ? parseInt(salaryRaw) : undefined;

  const startContractRaw = getFormDataField(formData, "startContract");
  const startContract = startContractRaw
    ? new Date(startContractRaw)
    : undefined;

  const endContractRaw = getFormDataField(formData, "endContract");
  const endContract = endContractRaw ? new Date(endContractRaw) : undefined;

  return {
    firstName: getFormDataField(formData, "firstName"),
    lastName: getFormDataField(formData, "lastName"),
    email: getFormDataField(formData, "email"),
    phoneNumber: getFormDataField(formData, "phoneNumber"),
    dateOfBirth,
    jobTitle: getFormDataField(formData, "jobTitle"),
    department: getFormDataField(formData, "department"),
    salary,
    startContract,
    endContract,
  };
};
