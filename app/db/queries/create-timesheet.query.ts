import type { CreateTimesheetFormSchema, QueryResult } from "~/interfaces";
import { getDB } from "../getDB";

export const createTimesheetQuery = async (
  form: CreateTimesheetFormSchema
): Promise<QueryResult> => {
  try {
    const db = await getDB();
    await db.run(
      "INSERT INTO timesheets (employee_id, start_time, end_time, summary) VALUES (?, ?, ?, ?)",
      [
        form.employeeId,
        form.startTime.toString(),
        form.endTime.toString(),
        form.summary,
      ]
    );
    return { isSuccess: true };
  } catch (error) {
    return { isSuccess: false, errorMessage: (error as Error).message };
  }
};
