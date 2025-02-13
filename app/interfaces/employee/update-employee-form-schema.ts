import type { BaseEmployeeFormSchema } from "./base-employee-form-schema";

export interface UpdateEmployeeFormSchema extends BaseEmployeeFormSchema {
  id: number;
  photo?: File;
}
