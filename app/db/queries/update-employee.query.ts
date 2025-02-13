import type { QueryResult, UpdateEmployeeFormSchema } from "~/interfaces";
import { getDB } from "../getDB";
import { uploadFile } from "~/utils";

export const updateEmployeeQuery = async (
  form: UpdateEmployeeFormSchema
): Promise<QueryResult> => {
  try {
    const db = await getDB();

    let query = `
      UPDATE employees
      SET first_name     = ?,
          last_name      = ?,
          email          = ?,
          phone_number   = ?,
          date_of_birth  = ?,
          job_title      = ?,
          department     = ?,
          salary         = ?,
          start_contract = ?,
          end_contract   = ?`;
    const params = [
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
    ];
    if (form.photo !== undefined && form.photo.size > 0) {
      const photoUrl = await uploadFile(form.photo);
      query += `, photo_url = ?`;
      params.push(photoUrl);
    }

    query += ` WHERE id = ?`;
    params.push(form.id);

    await db.run(query, ...params);

    return { isSuccess: true };
  } catch (error) {
    return { isSuccess: false, errorMessage: (error as Error).message };
  }
};
