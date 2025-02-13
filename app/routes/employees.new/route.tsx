import { useRef, useState, type ChangeEvent } from "react";
import {
  Form,
  redirect,
  type ActionFunction,
  useActionData,
} from "react-router";
import ErrorContainer from "~/components/error-container";
import InputField from "~/components/input-field";
import { DEFAULT_EMPLOYEE_PHOTO_URL } from "~/constants";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create New Employee
        </h1>

        <Form method="post" encType="multipart/form-data">
          <div className="flex justify-center items-center">
            <img
              src={photoUrl || DEFAULT_EMPLOYEE_PHOTO_URL}
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
              required
            />

            <InputField
              label="Last Name"
              id="lastName"
              name="lastName"
              type="text"
              required
            />

            <InputField
              label="Email"
              id="email"
              name="email"
              type="email"
              required
            />

            <InputField
              label="Phone Number"
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              required
            />

            <InputField
              label="Date Of Birth"
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
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
              required
            />

            <InputField
              label="Department"
              id="department"
              name="department"
              type="text"
              required
            />

            <InputField
              label="Start Contract"
              id="startContract"
              name="startContract"
              type="date"
              required
            />

            <InputField
              label="End Contract"
              id="endContract"
              name="endContract"
              type="date"
              required
            />
            <InputField
              label="Salary"
              id="salary"
              name="salary"
              type="number"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
          >
            Create Employee
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
      <div className="mt-6 flex justify-center">
        <a href="/employees" className="text-indigo-600 hover:underline">
          List of Employees
        </a>
      </div>
    </div>
  );
}
