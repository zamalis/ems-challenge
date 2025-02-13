import type { QueryResult, UpdateTimesheetFormSchema } from "~/interfaces";
import { getDB } from "../getDB";

export const updateTimesheetQuery = async (
  form: UpdateTimesheetFormSchema
): Promise<QueryResult> => {
  try {
    const db = await getDB();
    await db.run(
      `
      UPDATE timesheets
      SET employee_id = ?,
          start_time = ?,
          end_time = ?,
          summary = ?
      WHERE id = ?;`,
      [
        form.employeeId,
        form.startTime.toString(),
        form.endTime.toString(),
        form.summary,
        form.id,
      ]
    );

    return { isSuccess: true };
  } catch (error) {
    return { isSuccess: false, errorMessage: (error as Error).message };
  }
};
