import type { QueryResult } from "~/interfaces";
import { getDB } from "../getDB";

interface EmployeeRaw {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  jobTitle: string;
  department: string;
  salary: number;
  startContract: string;
  endContract: string;
  photoUrl: string;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  jobTitle: string;
  department: string;
  salary: number;
  startContract: Date;
  endContract: Date;
  photoUrl: string;
}

export const getEmployeeByIdQuery = async (
  employeeId: number
): Promise<QueryResult<Employee>> => {
  try {
    const db = await getDB();
    const rawData = await db.get<EmployeeRaw>(
      `SELECT
          e.id,
          e.first_name AS firstName,
          e.last_name AS lastName,
          e.email,
          e.phone_number AS phoneNumber,
          e.date_of_birth AS dateOfBirth,
          e.job_title AS jobTitle,
          e.department,
          e.salary,
          e.start_contract AS startContract,
          e.end_contract AS endContract,
          e.photo_url AS photoUrl
       FROM employees e
       WHERE e.id = ?;`,
      employeeId
    );
    if (!rawData) {
      return { isSuccess: false, errorMessage: "Employee not found" };
    }

    const data: Employee = {
      ...rawData,
      dateOfBirth: new Date(rawData.dateOfBirth),
      startContract: new Date(rawData.startContract),
      endContract: new Date(rawData.endContract),
    };

    return { isSuccess: true, data };
  } catch (error) {
    return { isSuccess: false, errorMessage: (error as Error).message };
  }
};
