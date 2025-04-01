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
      <div className="absolute top-0 right-0 w-full max-w-sm bg-[#1e1e1e] text-white p-4 z-30 rounded-bl-xl border-l border-b border-[#2a2a2a] shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-[#00aaff]">Capteurs en direct</h3>
          <button onClick={onClose} className="text-red-400 text-sm hover:text-red-300">Fermer</button>
        </div>
        <ul className="text-sm space-y-1">
          <li>🌡️ Température : <span className="text-gray-300">{data.temperature}°C</span></li>
          <li>🧪 Gaz : <span className="text-gray-300">{data.gas} ppm</span></li>
          <li>🧭 IMU : <span className="text-gray-300">{data.imu}</span></li>
        </ul>
      </div>
    )
  }
  