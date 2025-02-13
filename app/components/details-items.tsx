interface DetailItemProps {
  label: string;
  value: React.ReactNode;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div>
      <dt className="font-medium text-gray-700">{label}:</dt>
      <dd className="text-gray-900">{value}</dd>
    </div>
  );
}

export default DetailItem;
