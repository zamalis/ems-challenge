export interface FormValidationResult<T> {
  isValid: boolean;
  data: T;
  errors: Partial<Record<keyof T, string>>;
}
