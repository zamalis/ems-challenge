export const getFormDataField = <T extends FormDataEntryValue = string>(
  formData: FormData,
  field: string
): T | undefined => {
  const value = formData.get(field);
  if (value) {
    return value as T;
  }

  return undefined;
};
