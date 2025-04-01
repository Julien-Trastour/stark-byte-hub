import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { robotsAtom } from "../../store/robotAtom";
import {
  BatteryFull,
  Power,
  PanelTopOpen,
  Lightbulb,
  Sun,
} from "lucide-react";
import SensorPanel from "../../components/robots/SensorPanel";
import Joystick from "../../components/robots/Joystick";
import { Button } from "../../components/ui";

export default function RobotControlPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const robots = useAtomValue(robotsAtom);

  const [robot, setRobot] = useState(() => robots.find((r) => r.id === id) || null);
  const [showSensors, setShowSensors] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const found = robots.find((r) => r.id === id);
    if (!found) {
      navigate("/robots");
    } else {
      setRobot(found);
    }
  }, [id, robots, navigate]);

  if (!robot) return <div className="p-6 text-white">Chargement...</div>;

  const handleJoystickMove = (x: number, y: number) => {
    setLogs((prev) => [`Joystick: x=${x}, y=${y}`, ...prev.slice(0, 4)]);
  };

  const battery = robot.battery ?? 0;
  const statusColor =
    robot.status === "online" ? "text-green-400" : "text-red-400";

  const mockSensorData = {
    temperature: 24.5,
    gas: 200,
    imu: "OK",
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      {/* Flux caméra en fond */}
      <img
        src={`http://${robot.ip || "192.168.0.10"}/cam`}
        alt="Flux caméra"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      {/* Overlay de contrôle */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between">
        {/* En-tête avec infos robot */}
        <div className="flex justify-between items-center px-6 pt-4">
          <div className="flex items-center gap-4 text-sm">
            <span className="font-bold text-lg text-[#00aaff]">
              {robot.name || "Robot"}
            </span>
            <span className={statusColor}>
              {robot.status === "online" ? "En ligne" : "Hors ligne"}
            </span>
            <span className="flex items-center gap-1">
              <BatteryFull size={16} /> {battery}%
            </span>
          </div>

          <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSensors(true)}
          >
          <PanelTopOpen size={16} className="mr-2"/>
            Capteurs
          </Button>

          <Button
            variant="neon"
            size="sm"
            onClick={() => navigate("/robots")}
          >
          <Power size={16} className="mr-2"/>
            Quitter
          </Button>
          </div>
        </div>

        {/* Bas de l'écran : Joystick + Logs + LED/IR */}
        <div className="flex items-end justify-between px-6 pb-6 gap-6">
          {/* Joystick gauche */}
          <Joystick onMove={handleJoystickMove} size={120} />

          {/* Logs au centre */}
          <div className="flex-1 max-w-[500px] h-[120px] bg-black/30 border border-[#2a2a2a] rounded-xl p-2 text-sm text-gray-300 overflow-y-auto">
            <h3 className="text-xs text-[#00aaff] font-bold mb-1">
              Logs en temps réel
            </h3>
            <ul className="space-y-1">
              {logs.map((log) => (
                <li key={log} className="text-xs">
                    {log}
                </li>              
              ))}
            </ul>
          </div>

          {/* Boutons LED / IR à droite */}
          <div className="flex gap-2">
            <Button
              variant="neon"
              className="flex flex-col items-center justify-center w-16 px-4 py-6 gap-1 text-[#00aaff] hover:text-black hover:bg-[#00aaff]"
            >
              <Lightbulb size={20} />
              LED
            </Button>
            <Button
              variant="neon"
              className="flex flex-col items-center justify-center w-16 px-4 py-6 gap-1 text-[#00aaff] hover:text-black hover:bg-[#00aaff]"
            >
              <Sun size={20} />
              IR
            </Button>
          </div>
        </div>
      </div>

      {/* Panneau capteurs */}
      {showSensors && (
        <SensorPanel data={mockSensorData} onClose={() => setShowSensors(false)} />
      )}
    </div>
  );
}
