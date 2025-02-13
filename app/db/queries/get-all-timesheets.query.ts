import type { QueryResult } from "~/interfaces";
import { getDB } from "../getDB";

interface TimesheetRaw {
  id: number;
  startTime: string;
  endTime: string;
  summary: string;
  employeeFirstName: string;
  employeeLastName: string;
}

interface Timesheet {
  id: number;
  startTime: Date;
  endTime: Date;
  summary: string;
  employee: {
    firstName: string;
    lastName: string;
  };
}

export const getAllTimesheetsQuery = async (): Promise<
  QueryResult<Timesheet[]>
> => {
  try {
    const db = await getDB();
    const rawData = await db.all<TimesheetRaw[]>(
      `SELECT
        t.id,
        t.start_time AS startTime,
        t.end_time AS endTime,
        t.summary,
        e.first_name AS employeeFirstName,
        e.last_name AS employeeLastName
       FROM timesheets t
       LEFT JOIN employees e ON e.id = t.employee_id;`
    );

    const data: Timesheet[] = rawData.map((d) => ({
      ...d,
      startTime: new Date(d.startTime),
      endTime: new Date(d.endTime),
      employee: {
        firstName: d.employeeFirstName,
        lastName: d.employeeLastName,
      },
    }));

    return { isSuccess: true, data };
  } catch (error) {
    return { isSuccess: false, errorMessage: (error as Error).message };
  }
};
