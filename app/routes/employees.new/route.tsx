import { redirect, type ActionFunction, useActionData } from "react-router";
import EmployeeForm from "~/components/employee-form";
import { createEmployeeQuery } from "~/db/queries";
import type { FormValidationResult } from "~/interfaces";
import type { CreateEmployeeFormSchema } from "~/interfaces/employee";
import { mapCreateEmployeeForm } from "~/mappers";
import { validateCreateEmployeeForm } from "~/validators";

interface ActionResult {
  validationResult?: FormValidationResult<CreateEmployeeFormSchema>;
  error?: string;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const form = mapCreateEmployeeForm(formData);
  const { isValid, data, errors } = validateCreateEmployeeForm(form);

  if (!isValid) {
    return { validationResult: { isValid, errors } };
  }

  const result = await createEmployeeQuery(data);
  if (!result.isSuccess) {
    return { error: result.errorMessage };
  }

  return redirect("/employees");
};

export default function NewEmployeePage() {
  const actionData = useActionData<ActionResult>();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create New Employee
        </h1>
        <EmployeeForm actionData={actionData} />
      </div>
      <div className="mt-6 flex justify-center">
        <a href="/employees" className="text-indigo-600 hover:underline">
          List of Employees
        </a>
      </div>
    </div>
  );
}
