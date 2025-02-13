export type SortDirection = "asc" | "desc";

interface TableHeaderCellProps {
  label: string;
  className?: string;
  scope?: string;
  onClick?: () => void;
  sortDirection?: SortDirection;
}

function TableHeaderCell({
  label,
  className,
  scope = "col",
  onClick,
  sortDirection,
}: TableHeaderCellProps) {
  const arrowIcon =
    sortDirection === "asc" ? (
      <span className="ml-1">&#9650;</span> // Up arrow
    ) : sortDirection === "desc" ? (
      <span className="ml-1">&#9660;</span> // Down arrow
    ) : null;
  return (
    <th
      scope={scope}
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none ${className}`}
      onClick={onClick}
    >
      {label} {arrowIcon}
    </th>
  );
}

export default TableHeaderCell;
