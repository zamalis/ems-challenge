import { useRef, useState, type ChangeEvent } from "react";
import { Form, useLoaderData, useActionData, redirect } from "react-router";
import type { ActionFunction } from "react-router";
import DetailItem from "~/components/details-items";
import ErrorContainer from "~/components/error-container";
import InputField from "~/components/input-field";
import { DEFAULT_EMPLOYEE_PHOTO_URL } from "~/constants";
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoUrl, setPhotoUrl] = useState<string>(employee.photoUrl);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto gap-4  overflow-hidden flex flex-col md:flex-row">
        {/* Left Column: Form */}
        <div className="w-full md:w-1/2 p-8 bg-white rounded-lg ">
          <h1 className="text-2xl font-bold text-center mb-6">Edit Employee</h1>

          <Form method="post" encType="multipart/form-data">
            <div className="flex justify-center items-center">
              <img
                src={photoUrl}
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                alt="Photo"
                className="w-[150px] h-auto block mb-2 rounded-full cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="First Name"
                id="firstName"
                name="firstName"
                type="text"
                defaultValue={employee.firstName}
                required
              />

              <InputField
                label="Last Name"
                id="lastName"
                name="lastName"
                type="text"
                defaultValue={employee.lastName}
                required
              />

              <InputField
                label="Email"
                id="email"
                name="email"
                type="email"
                defaultValue={employee.email}
                required
              />

              <InputField
                label="Phone Number"
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                defaultValue={employee.phoneNumber}
                required
              />

              <InputField
                label="Date Of Birth"
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                defaultValue={employee.dateOfBirth.toISOString().split("T")[0]}
                required
              />

              <InputField
                ref={fileInputRef}
                label="Photo"
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                isHidden
                onChange={handleFileChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-10">
              <InputField
                label="Job Title"
                id="jobTitle"
                name="jobTitle"
                type="text"
                defaultValue={employee.jobTitle}
                required
              />

              <InputField
                label="Department"
                id="department"
                name="department"
                type="text"
                defaultValue={employee.department}
                required
              />

              <InputField
                label="Start Contract"
                id="startContract"
                name="startContract"
                type="date"
                defaultValue={
                  employee.startContract.toISOString().split("T")[0]
                }
                required
              />

              <InputField
                label="End Contract"
                id="endContract"
                name="endContract"
                type="date"
                defaultValue={employee.endContract.toISOString().split("T")[0]}
                required
              />
              <InputField
                label="Salary"
                id="salary"
                name="salary"
                type="number"
                defaultValue={employee.salary}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
            >
              Update Employee
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
