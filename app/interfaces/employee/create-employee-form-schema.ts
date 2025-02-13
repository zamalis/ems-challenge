import type { BaseEmployeeFormSchema } from "./base-employee-form-schema";

export interface CreateEmployeeFormSchema extends BaseEmployeeFormSchema {
  photo: File;
}
