import { useState } from "react";
import { X } from "lucide-react";
import { useSetAtom } from "jotai";
import { linkRobotAtom, fetchRobotsAtom } from "../../store/robotAtom";
import { Input, Button, Label } from "../ui";

type Props = {
  onClose: () => void;
  onSuccess?: () => void;
};

export default function LinkRobotModal({ onClose, onSuccess }: Props) {
  const [serialNumber, setSerialNumber] = useState("");
  const [linkKey, setLinkKey] = useState("");
  const [customName, setCustomName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const linkRobot = useSetAtom(linkRobotAtom);
  const fetchRobots = useSetAtom(fetchRobotsAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await linkRobot({ serialNumber, linkKey, name: customName });
      await fetchRobots();
      setSerialNumber("");
      setLinkKey("");
      setCustomName("");
      onSuccess?.();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Une erreur est survenue");
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeInUp px-4">
      <div className="w-full max-w-md rounded-lg border-l-4 border-[#00aaff]/30 bg-[#1e1e1e] p-8 shadow-lg shadow-[#00aaff]/10 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
  
        <h2 className="text-xl font-bold mb-5 text-white">Lier un robot existant</h2>
  
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="customName">Nom du robot</Label>
            <Input
              id="customName"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Ex: Mon Arachnobot"
              required
            />
          </div>
  
          <div>
            <Label htmlFor="serialNumber">Numéro de série</Label>
            <Input
              id="serialNumber"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="SBA-M1-V1-25032999"
              required
            />
          </div>
  
          <div>
            <Label htmlFor="linkKey">Clé de liaison</Label>
            <Input
              id="linkKey"
              value={linkKey}
              onChange={(e) => setLinkKey(e.target.value)}
              placeholder="ex : Z3ABQXP7"
              required
            />
          </div>
  
          {error && <p className="text-sm text-red-500">{error}</p>}
  
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="neon" disabled={loading}>
              {loading ? "Liaison en cours..." : "Lier le robot"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );  
}
