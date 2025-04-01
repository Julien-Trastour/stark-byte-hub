import { useNavigate } from 'react-router-dom'
import type { Robot } from '../../types/robot'
import { Button } from '../ui'

type Props = {
  robot: Robot
  onViewActivity: (robot: Robot) => void
  onViewDetails: (robot: Robot) => void
}

export default function RobotCard({ robot, onViewActivity, onViewDetails }: Props) {
  const navigate = useNavigate()

  const fallbackImage = `/robots/${robot.model?.toLowerCase() ?? 'default'}-${robot.color?.toLowerCase() ?? 'default'}.png`
  const imageUrl = robot.imageUrl || fallbackImage

  return (
    <div className="relative bg-[#1e1e1e] rounded-xl border-l-4 border-[#00aaff]/40 p-5 shadow-lg shadow-[#00aaff]/5 overflow-hidden group">
      {/* Halo visuel */}
      <div className="absolute -inset-1 z-0 blur-md bg-[#00aaff]/5 rounded-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full gap-3">
        {/* Image */}
        <img
          src={imageUrl}
          alt={robot.name}
          className="w-full h-32 object-contain rounded bg-black/20 border border-[#2a2a2a]"
        />

        {/* Infos */}
        <h3 className="text-lg font-bold text-white">{robot.name}</h3>
        <p className="text-sm text-gray-400">Modèle : {robot.model || 'Inconnu'}</p>
        <p className="text-sm">
          Statut :{' '}
          <span className={robot.status === 'online' ? 'text-green-400' : 'text-red-400'}>
            {robot.status === 'online' ? 'En ligne' : 'Hors ligne'}
          </span>
        </p>
        <p className="text-sm text-gray-400">Batterie : {robot.battery}%</p>
        <p className="text-sm text-gray-400">Dernière connexion : {robot.lastSeen}</p>

        {/* Boutons */}
        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            onClick={() => onViewActivity(robot)}
            className="flex-1 border-[#00aaff]/50 text-[#00aaff] hover:bg-[#00aaff] hover:text-black"
          >
            Activité
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate(`/robots/${robot.id}/control`)}
            className="flex-1 border-[#00aaff]/50 text-[#00aaff] hover:bg-[#00aaff] hover:text-black"
          >
            Contrôler
          </Button>

          <Button
            variant="outline"
            onClick={() => onViewDetails(robot)}
            className="flex-1 border-[#00aaff]/50 text-[#00aaff] hover:bg-[#00aaff] hover:text-black"
          >
            Détails
          </Button>
        </div>
      </div>
    </div>
  )
}
