interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
  label?: string;
  id: string;
  isHidden?: boolean;
}

function InputField({
  label,
  id,
  className = "",
  isHidden,
  ref,
  ...inputProps
}: InputFieldProps) {
  return (
    <div style={isHidden ? { display: "none" } : {}}>
      {label && (
        <label htmlFor={id} className="block text-gray-700 font-medium">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${className}`}
        {...inputProps}
      />
    </div>
  );
}

export default InputField;
