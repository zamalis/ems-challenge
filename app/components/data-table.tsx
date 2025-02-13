import { useMemo, useState, useEffect } from "react";
import TableDataCell from "./table-data";
import TableHeaderCell, { type SortDirection } from "./table-header";
import InputField from "./input-field";

interface BaseData {
  id: number;
}

export interface Column<T extends BaseData> {
  title: string;
  valueGetter: (row: T) => string;
}

interface DataTableProps<T extends BaseData> {
  columns: Column<T>[];
  rows: T[];
  onRowClick: (row: T) => void;
}

interface SortState {
  columnIndex: number;
  direction: SortDirection;
}

function DataTable<T extends BaseData>({
  columns,
  rows,
  onRowClick,
}: DataTableProps<T>) {
  const [sortState, setSortState] = useState<SortState | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const pageSize = 5;

  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    const lowerSearch = searchTerm.toLowerCase();
    return rows.filter((row) =>
      columns.some((column) =>
        column.valueGetter(row).toLowerCase().includes(lowerSearch)
      )
    );
  }, [rows, searchTerm, columns]);

  const sortedRows = useMemo(() => {
    if (!sortState) return filteredRows;

    const { columnIndex, direction } = sortState;
    const sortColumn = columns[columnIndex];

    return [...filteredRows].sort((a, b) => {
      const aValue = sortColumn.valueGetter(a);
      const bValue = sortColumn.valueGetter(b);

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredRows, sortState, columns]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const totalPages = Math.ceil(sortedRows.length / pageSize);
  const paginatedRows = useMemo(() => {
    const start = currentPage * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage]);

  const handleHeaderClick = (columnIndex: number) => {
    setSortState((prev) => {
      if (prev?.columnIndex === columnIndex) {
        if (prev.direction === "asc") {
          return { columnIndex, direction: "desc" };
        } else if (prev.direction === "desc") {
          return null;
        }
      }
      return { columnIndex, direction: "asc" };
    });
  };

  const startItem = sortedRows.length > 0 ? currentPage * pageSize + 1 : 0;
  const endItem =
    sortedRows.length > 0
      ? Math.min((currentPage + 1) * pageSize, sortedRows.length)
      : 0;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <InputField
          id="search-term"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="border p-2 rounded"
        />
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full bg-white">
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column, index) => {
                const isSorted = sortState?.columnIndex === index;
                const sortDirection = isSorted
                  ? sortState!.direction
                  : undefined;
                return (
                  <TableHeaderCell
                    key={index}
                    label={column.title}
                    onClick={() => handleHeaderClick(index)}
                    sortDirection={sortDirection}
                  />
                );
              })}
              <TableHeaderCell label="Actions" />
            </tr>
          </thead>
          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {paginatedRows.map((row) => (
              <tr
                key={row.id}
                className="bg-white hover:bg-gray-50 transition-colors"
              >
                {columns.map((column, index) => (
                  <TableDataCell key={index}>
                    {column.valueGetter(row)}
                  </TableDataCell>
                ))}
                <TableDataCell className="text-sm">
                  <button
                    onClick={() => onRowClick(row)}
                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    Edit
                  </button>
                </TableDataCell>
              </tr>
            ))}
            {paginatedRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="text-center p-4">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bottom Bar */}
      <div className="flex items-center justify-end mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="p-2 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {"<"}
        </button>
        <span className="px-2 text-sm">
          {`${startItem}–${endItem} of ${sortedRows.length}`}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
          }
          disabled={currentPage >= totalPages - 1 || sortedRows.length === 0}
          className="p-2 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}

export default DataTable;
