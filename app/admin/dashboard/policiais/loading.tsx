export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse text-center">
        <div className="h-12 w-12 rounded-full bg-police-blue mx-auto"></div>
        <p className="mt-4 text-gray-400">Carregando...</p>
      </div>
    </div>
  )
}
