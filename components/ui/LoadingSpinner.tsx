// components/ui/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export function LoadingSpinner({ fullScreen = false }: LoadingSpinnerProps) {
  const containerClass = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading questions...</p>
      </div>
    </div>
  );
}