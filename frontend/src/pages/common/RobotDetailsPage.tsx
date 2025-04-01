import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import { robotsAtom, fetchRobotsAtom } from '../../store/robotAtom'
import { Button } from "../../components/ui"
import { formatDistanceToNow } from "date-fns/formatDistanceToNow"
import { fr } from 'date-fns/locale'

export default function RobotDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const robots = useAtomValue(robotsAtom)
  const fetchRobots = useSetAtom(fetchRobotsAtom)

  const [robot, setRobot] = useState(robots.find(r => r.id === id) || null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    const existingRobot = robots.find(r => r.id === id)
    if (existingRobot) {
      setRobot(existingRobot)
      return
    }

    fetchRobots()
      .then(() => {
        const fetchedRobot = robots.find(r => r.id === id)
        if (fetchedRobot) {
          setRobot(fetchedRobot)
        } else {
          setError('Robot introuvable')
        }
      })
      .catch(() => setError('Erreur lors du chargement du robot'))
  }, [id, robots, fetchRobots])

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <p>{error}</p>
        <button type='button' onClick={() => navigate('/robots')} className="underline text-sm">
          ← Retour à la liste
        </button>
      </div>
    )
  }

  if (!robot) {
    return <div className="p-6 text-white">Chargement...</div>
  }

  const fallbackImage = `/robots/${(robot.model || 'default').toLowerCase()}-${(robot.color || 'default').toLowerCase()}.png`
  const imageUrl = robot.imageUrl || fallbackImage

  return (
    <div className="p-6 animate-fadeInUp">
      <section className="w-full bg-[#1e1e1e] border-l-4 border-[#00aaff]/30 rounded-lg p-8 shadow-lg shadow-[#00aaff]/10">
        <div className="flex flex-col gap-6">
          {/* Infos principales */}
          <div className="flex flex-col lg:flex-row gap-6">
            <img
              src={imageUrl}
              alt={robot.name}
              className="w-full max-w-[160px] h-auto object-contain rounded border border-[#2a2a2a] bg-black/20"
            />
            <div className="flex-1 text-sm text-white space-y-1">
              <h2 className="text-xl font-bold mb-2">
                Détails de <span className="text-[#00aaff]">{robot.name}</span>
              </h2>
              <p>
                🧠 Firmware : <span className="text-gray-300">{robot.firmware || 'inconnu'}</span>
              </p>
              <p>
                📶 Statut :{' '}
                <span className={robot.status === 'online' ? 'text-green-400' : 'text-red-400'}>
                  {robot.status === 'online' ? 'En ligne' : 'Hors ligne'}
                </span>
              </p>
              <p>
                🔋 Batterie : <span className="text-gray-300">{robot.battery ?? 'N/A'}%</span>
              </p>
              <p>
                🕐 Dernière connexion :{' '}
                <span className="text-gray-300">
                  {robot.lastSeen
                    ? formatDistanceToNow(new Date(robot.lastSeen), {
                        addSuffix: true,
                        locale: fr,
                      })
                    : 'Inconnue'}
                </span>
              </p>
              <p>
                🔗 Lié depuis : <span className="text-gray-300">{robot.linkedAt || 'inconnu'}</span>
              </p>
            </div>
            <div className="lg:self-start">
              <button
                type='button'
                onClick={() => navigate('/robots')}
                className="text-sm font-medium text-red-400 hover:text-red-300 transition"
              >
                ← Retour
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 border-t border-[#2a2a2a] pt-4">
            <Button variant="neon">🔄 Redémarrer</Button>
            <Button variant="neon">💤 Mise en veille</Button>
            <Button variant="neon">⬆️ Mettre à jour</Button>
            <Button variant="neon" onClick={() => navigate(`/robots/${robot.id}/control`)}>
              🎮 Contrôler
            </Button>
          </div>

          {/* Capteurs & Activité */}
          <div className="flex flex-col lg:flex-row gap-6 border-t border-[#2a2a2a] pt-4">
            <div className="flex-1 rounded-lg border-l-4 border-[#00aaff]/30 bg-[#1e1e1e] p-4 shadow-md shadow-[#00aaff]/5">
                <h3 className="text-lg font-semibold mb-2 text-white">🔧 Capteurs en direct</h3>
                <p className="text-sm text-gray-400 italic">(À venir : température, gaz, IMU, etc.)</p>
            </div>
            <div className="flex-1 rounded-lg border-l-4 border-[#00aaff]/30 bg-[#1e1e1e] p-4 shadow-md shadow-[#00aaff]/5">
                <h3 className="text-lg font-semibold mb-2 text-white">🗂️ Activité récente</h3>
                <p className="text-sm text-gray-400 italic">(À venir : historique des mouvements, logs système…)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
