export default function AdvisoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-1">AI Advisory</h1>
      <p className="text-green-600 text-sm mb-8">Personalised crop advice powered by Claude</p>

      <div className="bg-white rounded-xl shadow p-8 text-center max-w-lg mx-auto">
        <div className="text-5xl mb-4">🌱</div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Coming Soon</h2>
        <p className="text-gray-500 text-sm mb-4">
          The AI advisory system will provide personalised recommendations based on each farmer&apos;s
          crop history, soil conditions, and local weather data.
        </p>
        <div className="text-left bg-gray-50 rounded-lg p-4 text-xs text-gray-500 space-y-1">
          <p className="font-medium text-gray-700 mb-2">Planned features:</p>
          <p>&#10003; Crop disease detection from field descriptions</p>
          <p>&#10003; Harvest timing recommendations</p>
          <p>&#10003; Market price guidance</p>
          <p>&#10003; Input cost optimisation</p>
          <p>&#10003; USSD-accessible advice summaries</p>
        </div>
      </div>
    </div>
  )
}
