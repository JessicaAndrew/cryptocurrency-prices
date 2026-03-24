export interface LoadingProps {
  message?: string
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center py-16">
    <div className="text-center">
      <div className="inline-block animate-spin text-4xl mb-4">⟳</div>
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  </div>
)
