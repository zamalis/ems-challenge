import { useRef, useState, type ChangeEvent } from "react";
import { Form } from "react-router";
import { DEFAULT_EMPLOYEE_PHOTO_URL } from "~/constants";
import type { Employee } from "~/db/queries/get-employee-by-id.query";
import InputField from "./input-field";
import type {
  CreateEmployeeFormSchema,
  FormValidationResult,
  UpdateEmployeeFormSchema,
} from "~/interfaces";
import ErrorContainer from "./error-container";

interface EmployeeFormProps {
  employee?: Employee;
  actionData?: {
    validationResult?: FormValidationResult<
      CreateEmployeeFormSchema | UpdateEmployeeFormSchema
    >;
    error?: string;
  };
}

const EmployeeForm = ({ employee, actionData }: EmployeeFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoUrl, setPhotoUrl] = useState<string>(
    employee?.photoUrl || DEFAULT_EMPLOYEE_PHOTO_URL
  );

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
    <>
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
            defaultValue={employee?.firstName}
            required
          />

          <InputField
            label="Last Name"
            id="lastName"
            name="lastName"
            type="text"
            defaultValue={employee?.lastName}
            required
          />

          <InputField
            label="Email"
            id="email"
            name="email"
            type="email"
            defaultValue={employee?.email}
            required
          />

          <InputField
            label="Phone Number"
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            defaultValue={employee?.phoneNumber}
            required
          />

          <InputField
            label="Date Of Birth"
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            defaultValue={employee?.dateOfBirth.toISOString().split("T")[0]}
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
            defaultValue={employee?.jobTitle}
            required
          />

          <InputField
            label="Department"
            id="department"
            name="department"
            type="text"
            defaultValue={employee?.department}
            required
          />

          <InputField
            label="Start Contract"
            id="startContract"
            name="startContract"
            type="date"
            defaultValue={employee?.startContract.toISOString().split("T")[0]}
            required
          />

          <InputField
            label="End Contract"
            id="endContract"
            name="endContract"
            type="date"
            defaultValue={employee?.endContract.toISOString().split("T")[0]}
            required
          />
          <InputField
            label="Salary"
            id="salary"
            name="salary"
            type="number"
            defaultValue={employee?.salary}
            required
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
        >
          Submit
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
    </>
  );
};

export default EmployeeForm;
