import type { QueryResult } from "~/interfaces";
import { getDB } from "../getDB";

interface TimesheetRaw {
  id: number;
  startTime: string;
  endTime: string;
  summary: string;
  employeeId: number;
}

export interface Timesheet {
  id: number;
  startTime: Date;
  endTime: Date;
  summary: string;
  employeeId: number;
}

export const getTimesheetByIdQuery = async (
  timesheetId: number
): Promise<QueryResult<Timesheet>> => {
  try {
    const db = await getDB();
    const rawData = await db.get<TimesheetRaw>(
      ` SELECT 
          t.start_time AS startTime, 
          t.end_time AS endTime,
          t.summary,
          t.employee_id AS employeeId
        FROM timesheets t   
        WHERE t.id = ?;`,
      timesheetId
    );
    if (!rawData) {
      return { isSuccess: false, errorMessage: "Timesheet not found" };
    }

    const data: Timesheet = {
      ...rawData,
      startTime: new Date(rawData.startTime),
      endTime: new Date(rawData.endTime),
    };

    return { isSuccess: true, data };
  } catch (error) {
    return { isSuccess: false, errorMessage: (error as Error).message };
  }
};
