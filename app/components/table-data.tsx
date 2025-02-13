interface TableDataCellProps {
  children: React.ReactNode;
  className?: string;
}

function TableDataCell({
  children,
  className = "",
  ...props
}: TableDataCellProps) {
  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}

export default TableDataCell;
