import { useState } from 'react'
import { X } from 'lucide-react'
import { useSetAtom } from 'jotai'
import { linkRobotAtom, fetchRobotsAtom } from '../../store/robotAtom'
import { Input, Button } from '../ui'

type Props = {
  onClose: () => void
  onSuccess?: () => void
}

export default function LinkRobotModal({ onClose, onSuccess }: Props) {
  const [serialNumber, setSerialNumber] = useState('')
  const [linkKey, setLinkKey] = useState('')
  const [customName, setCustomName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const linkRobot = useSetAtom(linkRobotAtom)
  const fetchRobots = useSetAtom(fetchRobotsAtom)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await linkRobot({ serialNumber, linkKey, name: customName })
      await fetchRobots()
      setSerialNumber('')
      setLinkKey('')
      setCustomName('')
      onSuccess?.()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeInUp">
      <div className="relative w-full max-w-md rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-6 shadow-xl shadow-[#00aaff]/10">
        <div className="absolute -inset-1 z-0 blur-md bg-[#00aaff]/10 rounded-xl" />
        <div className="relative z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold mb-5 text-white">Lier un robot existant</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nom du robot</label>
              <Input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Ex: Mon Arachnobot"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Numéro de série</label>
              <Input
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="SBA-M1-V1-25032999"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Clé de liaison</label>
              <Input
                value={linkKey}
                onChange={(e) => setLinkKey(e.target.value)}
                placeholder="ex : Z3ABQXP7"
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Liaison en cours...' : 'Lier le robot'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
