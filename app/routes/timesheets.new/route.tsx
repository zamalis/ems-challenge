import { useLoaderData, redirect, useActionData } from "react-router";
import type { ActionFunction } from "react-router";
import { createTimesheetQuery, getAllEmployeesQuery } from "~/db/queries";
import type {
  CreateTimesheetFormSchema,
  FormValidationResult,
} from "~/interfaces";
import { mapCreateTimesheetForm } from "~/mappers";
import { validateCreateETimesheetForm } from "~/validators";
import TimesheetForm from "~/components/timesheet-form";

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
        <TimesheetForm employees={employees} actionData={actionData} />
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
