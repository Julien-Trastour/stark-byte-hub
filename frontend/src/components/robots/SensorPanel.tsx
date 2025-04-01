type SensorData = {
  temperature: number
  gas: number
  imu: string
}

type Props = {
  data: SensorData
  onClose: () => void
}

export default function SensorPanel({ data, onClose }: Props) {
  return (
    <div className="absolute top-0 right-0 w-full max-w-sm z-30">
      <div className="rounded-bl-xl border-l-4 border-[#00aaff]/30 bg-[#1e1e1e] p-5 shadow-lg shadow-[#00aaff]/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">🔧 Capteurs en direct</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-red-400 hover:text-red-300 transition"
          >
            ✕
          </button>
        </div>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>
            🌡️ Température : <span className="font-semibold">{data.temperature}°C</span>
          </li>
          <li>
            🧪 Gaz : <span className="font-semibold">{data.gas} ppm</span>
          </li>
          <li>
            🧭 IMU : <span className="font-semibold">{data.imu}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
