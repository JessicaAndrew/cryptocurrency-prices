export interface ErrorProps {
  message: string
  onRetry?: () => void
}

export const Error: React.FC<ErrorProps> = ({ message, onRetry }) => (
  <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 my-6">
    <div className="text-red-400 font-semibold mb-2">⚠ Error</div>
    <p className="text-red-300 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition"
      >
        Try Again
      </button>
    )}
  </div>
)
