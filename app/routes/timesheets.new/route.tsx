import { useLoaderData, Form, redirect, useActionData } from "react-router";
import type { ActionFunction } from "react-router";
import InputField from "~/components/input-field";
import { createTimesheetQuery, getAllEmployeesQuery } from "~/db/queries";
import type {
  CreateTimesheetFormSchema,
  FormValidationResult,
} from "~/interfaces";
import { mapCreateTimesheetForm } from "~/mappers";
import { validateCreateETimesheetForm } from "~/validators";
import ErrorContainer from "~/components/error-container";

interface ActionResult {
  validationResult?: FormValidationResult<CreateTimesheetFormSchema>;
  error?: string;
}

export async function loader() {
  return getAllEmployeesQuery();
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const form = mapCreateTimesheetForm(formData);
  const { isValid, data, errors } = validateCreateETimesheetForm(form);

  if (!isValid) {
    return { validationResult: { isValid, errors } };
  }

  const result = await createTimesheetQuery(data);
  if (!result.isSuccess) {
    return { error: result.errorMessage };
  }

  return redirect("/timesheets");
};

export default function NewTimesheetPage() {
  const { data: employees } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionResult>();

  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create New Timesheet
        </h1>
        <Form method="post">
          <div className="flex flex-col gap-4">
            {/* Employee select field with label */}
            <div>
              <label
                htmlFor="employeeId"
                className="block text-gray-700 font-medium"
              >
                Employee
              </label>
              <select
                name="employeeId"
                id="employeeId"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {(employees || []).map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ))}
              </select>
            </div>

            <InputField
              label="Start Time"
              id="startTime"
              name="startTime"
              type="datetime-local"
              required
            />
            <InputField
              label="End Time"
              id="endTime"
              name="endTime"
              type="datetime-local"
              required
            />

            <InputField
              label="Summary"
              id="summary"
              name="summary"
              type="text"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
          >
            Create Timesheet
          </button>
        </Form>

        {/* Validation Errors */}
        {actionData?.validationResult?.isValid === false && (
          <ErrorContainer>
            {Object.values(actionData.validationResult?.errors).map(
              (error, index) => (
                <h4 key={index}>{error}</h4>
              )
            )}
          </ErrorContainer>
        )}

        {/* General Error */}
        {actionData?.error && (
          <ErrorContainer>
            <h4>{actionData?.error}</h4>
          </ErrorContainer>
        )}
      </div>
      <ul className="flex justify-center gap-10">
        <li>
          <a href="/timesheets" className="text-indigo-600 hover:underline">
            List of Timesheets
          </a>
        </li>
        <li>
          <a href="/employees" className="text-indigo-600 hover:underline">
            List of Employees
          </a>
        </li>
      </ul>
    </div>
  );
}
