import type { QueryResult } from "~/interfaces";
import { getDB } from "../getDB";

interface EmployeeRaw {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  salary: number;
  startContract: string;
  endContract: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  salary: number;
  startContract: Date;
  endContract: Date;
}

export const getAllEmployeesQuery = async (): Promise<
  QueryResult<Employee[]>
> => {
  try {
    const db = await getDB();
    const rawData = await db.all<EmployeeRaw[]>(
      `SELECT
          e.id,
          e.first_name AS firstName,
          e.last_name AS lastName,
          e.job_title AS jobTitle,
          e.salary,
          e.start_contract AS startContract,
          e.end_contract AS endContract
       FROM employees e;`
    );

    const data: Employee[] = rawData.map((d) => ({
      ...d,
      startContract: new Date(d.startContract),
      endContract: new Date(d.endContract),
    }));

    return { isSuccess: true, data };
  } catch (error) {
    return { isSuccess: false, errorMessage: (error as Error).message };
  }
};
