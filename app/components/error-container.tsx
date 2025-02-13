import type { ReactNode } from "react";

interface ErrorContainerProps {
  children: ReactNode;
}

function ErrorContainer({ children }: ErrorContainerProps) {
  return (
    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <div className="list-disc pl-5">{children}</div>
    </div>
  );
}

export default ErrorContainer;
