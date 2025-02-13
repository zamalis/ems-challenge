import {
  redirect,
  useActionData,
  useLoaderData,
  type ActionFunction,
} from "react-router";
import TimesheetForm from "~/components/timesheet-form";
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
          <TimesheetForm
            employees={employees}
            actionData={actionData}
            timesheet={timesheet}
          />
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
