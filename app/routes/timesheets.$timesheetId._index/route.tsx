import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  type ActionFunction,
} from "react-router";
import ErrorContainer from "~/components/error-container";
import InputField from "~/components/input-field";
import {
  getAllEmployeesQuery,
  getTimesheetByIdQuery,
  updateTimesheetQuery,
} from "~/db/queries";
import type {
  FormValidationResult,
  UpdateTimesheetFormSchema,
} from "~/interfaces";
import { mapUpdateTimesheetForm } from "~/mappers";
import { getFormattedCalendarDateTime } from "~/utils/dates/date-utils";
import { validateUpdateTimesheetForm } from "~/validators";

interface ActionResult {
  validationResult?: FormValidationResult<UpdateTimesheetFormSchema>;
  error?: string;
}

export async function loader({ params }: { params: { timesheetId: string } }) {
  const { timesheetId: timesheetIdRaw } = params;
  const timesheetId = parseInt(timesheetIdRaw);

  if (isNaN(timesheetId)) {
    return redirect("/timesheets");
  }

  const timesheetResult = await getTimesheetByIdQuery(timesheetId);
  if (!timesheetResult.isSuccess) {
    return redirect("/timesheets");
  }

  const employeesResult = await getAllEmployeesQuery();

  return { employeesResult, timesheetResult };
}

export const action: ActionFunction = async ({ request, params }) => {
  const { timesheetId } = params;

  const formData = await request.formData();
  formData.append("id", timesheetId!);

  const form = mapUpdateTimesheetForm(formData);
  const { isValid, data, errors } = validateUpdateTimesheetForm(form);

  if (!isValid) {
    return { validationResult: { isValid, errors } };
  }

  const result = await updateTimesheetQuery(data);
  if (!result.isSuccess) {
    return { error: result.errorMessage };
  }

  return redirect("/timesheets");
};

export default function TimesheetPage() {
  const { employeesResult, timesheetResult } = useLoaderData<typeof loader>();
  const { data: employees } = employeesResult;
  const timesheet = timesheetResult.data!;

  const actionData = useActionData<ActionResult>();

  return (
    <div>
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Update Timesheet
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
                defaultValue={getFormattedCalendarDateTime(timesheet.startTime)}
                required
              />
              <InputField
                label="End Time"
                id="endTime"
                name="endTime"
                type="datetime-local"
                defaultValue={getFormattedCalendarDateTime(timesheet.endTime)}
                required
              />

              <InputField
                label="Summary"
                id="summary"
                name="summary"
                type="text"
                defaultValue={timesheet.summary}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
            >
              Update Timesheet
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
    </div>
  );
}
