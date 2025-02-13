import { useLoaderData, useNavigate } from "react-router";
import { getDB } from "~/db/getDB";
import { useEffect, useMemo, useState } from "react";
// import { getAllTimesheetsQuery } from "~/db/queries";
import type { QueryResult } from "~/interfaces";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  type CalendarEventExternal,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import {
  getFormattedCalendarDateTime,
  getFormattedDateTime,
} from "~/utils/dates/date-utils";
import ErrorContainer from "~/components/error-container";
import type { Column } from "~/components/data-table";
import DataTable from "~/components/data-table";

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

const getAllTimesheetsQuery = async (): Promise<QueryResult<Timesheet[]>> => {
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

export async function loader() {
  return await getAllTimesheetsQuery();
}

export default function TimesheetsPage() {
  const {
    isSuccess,
    data: timesheets,
    errorMessage,
  } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [tableView, setTableView] = useState(true);
  const handleEditTimeSheet = (id: number) => {
    navigate(`/timesheets/${id}`);
  };
  const handleTableView = () => {
    setTableView((newTableview) => !newTableview);
  };

  const events: CalendarEventExternal[] = useMemo(
    (): CalendarEventExternal[] =>
      (timesheets || []).map((event) => ({
        id: event.id,
        title: `${event.employee.firstName} ${event.employee.lastName}`,
        start: getFormattedCalendarDateTime(event.startTime),
        end: getFormattedCalendarDateTime(event.endTime),
        location: event.summary,
      })),
    [timesheets]
  );

  const eventsService = useState(() => createEventsServicePlugin())[0];
  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: events,
    plugins: [eventsService],
  });

  useEffect(() => {
    // get all events
    eventsService.getAll();
  }, []);

  const columns: Column<Timesheet>[] = [
    {
      title: "Full Name",
      valueGetter: (row) =>
        `${row.employee.firstName} ${row.employee.lastName}`,
    },
    {
      title: "Start Time",
      valueGetter: (row) => getFormattedDateTime(row.startTime),
    },
    {
      title: "End Time",
      valueGetter: (row) => getFormattedDateTime(row.endTime),
    },
    {
      title: "Summary",
      valueGetter: (row) => row.summary,
    },
  ];

  return (
    <div className="flex flex-col justify-center ">
      {isSuccess ? (
        <>
          <div className="flex justify-center items-center">
            <p>Table View</p>
            <div className="flex gap-10 p-4 justify-end">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  onChange={handleTableView}
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-200" />
                <div className="absolute left-1 top-1 bg-white border border-gray-300 w-4 h-4 rounded-full transition-transform duration-200 peer-checked:translate-x-5" />
              </label>
            </div>
            <p>Calender view</p>
          </div>
          {tableView ? (
            <div className="container mx-auto px-4 py-8">
              <DataTable
                columns={columns}
                rows={timesheets || []}
                onRowClick={(row) => handleEditTimeSheet(row.id)}
              />
            </div>
          ) : (
            <div>
              <ScheduleXCalendar calendarApp={calendar} />
            </div>
          )}
        </>
      ) : (
        <ErrorContainer>
          <h4>{errorMessage}</h4>
        </ErrorContainer>
      )}
      {/* Navigation Links */}
      <div className="mt-6">
        <ul className="flex gap-10 justify-center">
          <li>
            <a
              href="/timesheets/new"
              className="text-blue-600 hover:underline font-medium"
            >
              New Timesheet
            </a>
          </li>
          <li>
            <a
              href="/employees/"
              className="text-blue-600 hover:underline font-medium"
            >
              List of Employees
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

// href="https://schedule-x.dev/docs/frameworks/react">
