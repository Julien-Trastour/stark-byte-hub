type Props = {
  alerts: string[]
}

export default function AlertList({ alerts }: Props) {
  const hasAlerts = alerts.length > 0

  return (
    <section className="relative rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-5 shadow-md overflow-hidden">
      {hasAlerts && (
        <div className="absolute -inset-1 blur-md bg-red-500/10 rounded-xl z-0 pointer-events-none" />
      )}

      <div className="relative z-10">
        <h2 className="text-lg font-semibold text-white mb-3">Alertes actives</h2>

        {hasAlerts ? (
          <ul className="text-sm text-red-300 list-disc pl-5 space-y-1 marker:text-red-400">
            {alerts.map((alert, idx) => (
              <li key={idx}>{alert}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-gray-500">Aucune alerte en cours.</p>
        )}
      </div>
    </section>
  )
}
