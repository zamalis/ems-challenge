import { useLoaderData, useActionData, redirect } from "react-router";
import type { ActionFunction } from "react-router";
import DetailItem from "~/components/details-items";
import EmployeeForm from "~/components/employee-form";
import { getEmployeeByIdQuery, updateEmployeeQuery } from "~/db/queries";
import type { FormValidationResult } from "~/interfaces";
import type { UpdateEmployeeFormSchema } from "~/interfaces/employee";
import { mapUpdateEmployeeForm } from "~/mappers";
import { getFormattedDate } from "~/utils/dates/date-utils";
import { validateUpdateEmployeeForm } from "~/validators";

interface ActionResult {
  validationResult?: FormValidationResult<UpdateEmployeeFormSchema>;
  error?: string;
}

export async function loader({ params }: { params: { employeeId: string } }) {
  const { employeeId: employeeIdRaw } = params;
  const employeeId = parseInt(employeeIdRaw);

  if (isNaN(employeeId)) {
    return redirect("/employees");
  }

  const result = await getEmployeeByIdQuery(employeeId);
  if (!result.isSuccess) {
    return redirect("/employees");
  }

  return result;
}

export const action: ActionFunction = async ({ request, params }) => {
  const { employeeId } = params;

  const formData = await request.formData();
  formData.append("id", employeeId!);

  const form = mapUpdateEmployeeForm(formData);
  const { isValid, data, errors } = validateUpdateEmployeeForm(form);

  if (!isValid) {
    return { validationResult: { isValid, errors } };
  }

  const result = await updateEmployeeQuery(data);
  if (!result.isSuccess) {
    return { error: result.errorMessage };
  }

  return redirect("/employees");
};

export default function EditEmployeePage() {
  const loaderData = useLoaderData<typeof loader>();
  const employee = loaderData.data!;

  const actionData = useActionData<ActionResult>();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto gap-4  overflow-hidden flex flex-col md:flex-row">
        {/* Left Column: Form */}
        <div className="w-full md:w-1/2 p-8 bg-white rounded-lg ">
          <h1 className="text-2xl font-bold text-center mb-6">Edit Employee</h1>
          <EmployeeForm actionData={actionData} employee={employee} />
        </div>

        {/* Right Column: Display Employee Information */}
        <div className="w-full md:w-1/2 p-8 rounded-lg bg-white ">
          <h2 className="text-xl font-bold mb-4">Employee Details</h2>
          <dl className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="First Name" value={employee.firstName} />
              <DetailItem label="Last Name" value={employee.lastName} />
              <DetailItem label="Email" value={employee.email} />
              <DetailItem label="Phone Number" value={employee.phoneNumber} />
              <DetailItem
                label="Date Of Birth"
                value={getFormattedDate(employee.dateOfBirth)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-10">
              <DetailItem label="Job Title" value={employee.jobTitle} />
              <DetailItem label="Department" value={employee.department} />
              <DetailItem
                label="Start Contract"
                value={getFormattedDate(employee.startContract)}
              />
              <DetailItem
                label="End Contract"
                value={getFormattedDate(employee.endContract)}
              />
              <DetailItem label="Salary" value={employee.salary} />
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-6 flex justify-center gap-6">
        <a href="/employees" className="text-indigo-600 hover:underline">
          List of Employees
        </a>
      </div>
    </div>
  );
}
