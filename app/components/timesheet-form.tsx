import type { Employee, Timesheet } from "~/db/queries";
import ErrorContainer from "./error-container";
import type {
  CreateTimesheetFormSchema,
  FormValidationResult,
  UpdateTimesheetFormSchema,
} from "~/interfaces";
import { Form } from "react-router";
import InputField from "./input-field";
import { getFormattedCalendarDateTime } from "~/utils/dates/date-utils";

interface TimesheetFormProps {
  employees?: Employee[];
  timesheet?: Timesheet;
  actionData?: {
    validationResult?: FormValidationResult<
      CreateTimesheetFormSchema | UpdateTimesheetFormSchema
    >;
    error?: string;
  };
}

const TimesheetForm = ({
  employees,
  timesheet,
  actionData,
}: TimesheetFormProps) => {
  return (
    <>
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
              defaultValue={timesheet?.employeeId}
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
            defaultValue={
              timesheet?.startTime
                ? getFormattedCalendarDateTime(timesheet.startTime)
                : undefined
            }
            required
          />
          <InputField
            label="End Time"
            id="endTime"
            name="endTime"
            type="datetime-local"
            defaultValue={
              timesheet?.endTime
                ? getFormattedCalendarDateTime(timesheet.endTime)
                : undefined
            }
            required
          />

          <InputField
            label="Summary"
            id="summary"
            name="summary"
            type="text"
            defaultValue={timesheet?.summary}
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

export default TimesheetForm;
