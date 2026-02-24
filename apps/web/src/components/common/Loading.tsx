export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary-600" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-primary-100 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
