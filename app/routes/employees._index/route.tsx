import { useLoaderData, useNavigate } from "react-router";
import type { Column } from "~/components/data-table";
import DataTable from "~/components/data-table";
import ErrorContainer from "~/components/error-container";
import { getAllEmployeesQuery, type Employee } from "~/db/queries";
import { getFormattedDate } from "~/utils/dates/date-utils";

export async function loader() {
  return await getAllEmployeesQuery();
}

export default function EmployeesPage() {
  const {
    isSuccess,
    data: employees,
    errorMessage,
  } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleEditEmployee = (id: number) => {
    navigate(`/employees/${id}`);
  };

  const columns: Column<Employee>[] = [
    {
      title: "Full Name",
      valueGetter: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      title: "Job Title",
      valueGetter: (row) => row.jobTitle,
    },
    {
      title: "Salary",
      valueGetter: (row) => `${row.salary}$`,
    },
    {
      title: "Start Contract",
      valueGetter: (row) => getFormattedDate(row.startContract),
    },
    {
      title: "End Contract",
      valueGetter: (row) => getFormattedDate(row.endContract),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {isSuccess ? (
        <DataTable
          columns={columns}
          rows={employees || []}
          onRowClick={(row) => handleEditEmployee(row.id)}
        />
      ) : (
        <ErrorContainer>
          <h4>{errorMessage}</h4>
        </ErrorContainer>
      )}
      {/* Navigation Links */}
      <div className="mt-6">
        <ul className="flex justify-center gap-10">
          <li>
            <a
              href="/employees/new"
              className="text-blue-600 hover:underline font-medium"
            >
              New Employee
            </a>
          </li>
          <li>
            <a
              href="/timesheets/"
              className="text-blue-600 hover:underline font-medium"
            >
              List of Timesheets
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
