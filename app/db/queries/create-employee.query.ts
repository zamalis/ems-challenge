import type { CreateEmployeeFormSchema, QueryResult } from "~/interfaces";
import { getDB } from "../getDB";
import { uploadFile } from "~/utils";

export const createEmployeeQuery = async (
  form: CreateEmployeeFormSchema
): Promise<QueryResult> => {
  try {
    const photoUrl = await uploadFile(form.photo);

    const db = await getDB();
    await db.run(
      `INSERT INTO employees (first_name, last_name, email, phone_number, date_of_birth, job_title, department, salary, start_contract, end_contract, photo_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        form.firstName,
        form.lastName,
        form.email,
        form.phoneNumber,
        form.dateOfBirth.toString(),
        form.jobTitle,
        form.department,
        form.salary,
        form.startContract.toString(),
        form.endContract.toString(),
        photoUrl,
      ]
    );
    return { isSuccess: true };
  } catch (error) {
    return { isSuccess: false, errorMessage: (error as Error).message };
  }
};
