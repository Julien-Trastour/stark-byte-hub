import { useEffect, useRef, useState } from "react";
import { useSetAtom } from "jotai";
import { addRobotAtom, updateRobotAtom } from "../../../store/robotAtom";
import type { CreateRobotPayload, Robot } from "../../../types/robot";
import { Dialog, Input, Button, Checkbox, Label } from "../../ui";
import Papa from "papaparse";
import { toast } from "sonner";
import { createMultipleRobots } from "../../../services/robotService";

type Props = {
  onClose: () => void;
  onRefresh: () => void;
  robot?: Robot;
};

export default function RobotAdminModal({ onClose, onRefresh, robot }: Props) {
  const isEdit = !!robot;
  const [activeTab, setActiveTab] = useState<"standard" | "csv">("standard");
  const [formData, setFormData] = useState<CreateRobotPayload>({
    serialNumber: "",
    linkKey: "",
    firmware: "",
    color: "",
    controllable: true,
    model: "",
  });
  const [csvRobots, setCsvRobots] = useState<CreateRobotPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addRobot = useSetAtom(addRobotAtom);
  const updateRobot = useSetAtom(updateRobotAtom);

  useEffect(() => {
    if (robot) {
      setFormData({
        serialNumber: robot.serialNumber,
        linkKey: robot.linkKey,
        firmware: robot.firmware || "",
        color: robot.color,
        controllable: robot.controllable,
        model: robot.model || "",
      });
    }
  }, [robot]);

  const handleSave = async () => {
    try {
      setLoading(true);
      if (isEdit && robot) {
        await updateRobot({ id: robot.id, data: formData });
        toast.success("Robot modifié avec succès");
      } else {
        await addRobot(formData);
        toast.success("Robot ajouté avec succès");
      }
      await onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = (file?: File) => {
    if (!file) return;
    Papa.parse<CreateRobotPayload>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const valid = results.data.filter(
          (r) =>
            r.serialNumber &&
            r.linkKey &&
            r.model &&
            r.firmware &&
            r.color &&
            typeof r.controllable !== "undefined"
        );
        if (valid.length === 0) {
          toast.error("Aucun robot valide détecté.");
          return;
        }
        setCsvRobots(valid);
        toast.success(`${valid.length} robots détectés`);
      },
      error: (err) => {
        toast.error("Erreur lors du parsing du fichier CSV.");
        console.error(err);
      },
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCsvImportConfirm = async () => {
    try {
      setLoading(true);
      await createMultipleRobots(csvRobots);
      await onRefresh();
      toast.success("Import CSV terminé ✅");
      setCsvRobots([]);
      onClose();
    } catch (err) {
      toast.error("Erreur lors de l’import CSV");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCsvDownload = async () => {
    const response = await fetch("/static/robots-template.csv");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "robots-template.csv";
    link.click();
  };

  return (
    <Dialog onClose={onClose}>
      <div className="w-full max-w-2xl rounded-lg border-l-4 border-[#00aaff]/30 bg-[#1e1e1e] p-8 shadow-lg shadow-[#00aaff]/10 relative">
        {/* BOUTON DE FERMETURE CUSTOM 👇 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
          aria-label="Fermer"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-white">
          {isEdit ? "Modifier un robot" : "Ajouter des robots"}
        </h2>

        {!isEdit && (
          <>
            <div className="flex justify-center gap-4 mb-4">
              <Button
                type="button"
                variant={activeTab === "standard" ? "neon" : "outline"}
                onClick={() => setActiveTab("standard")}
              >
                Import manuel
              </Button>
              <Button
                type="button"
                variant={activeTab === "csv" ? "neon" : "outline"}
                onClick={() => setActiveTab("csv")}
              >
                Import CSV
              </Button>
            </div>
            <p className="text-center text-sm text-gray-400 mb-6">
              Choisissez un mode d'ajout : manuel via formulaire ou import en masse via un fichier CSV.
            </p>
          </>
        )}

        {(isEdit || activeTab === "standard") && (
          <div className="space-y-4">
            <div>
              <Label>Numéro de série</Label>
              <Input
                value={formData.serialNumber}
                onChange={(e) =>
                  setFormData({ ...formData, serialNumber: e.target.value })
                }
                disabled={isEdit}
              />
            </div>
            <div>
              <Label>Clé de liaison</Label>
              <Input
                value={formData.linkKey}
                onChange={(e) =>
                  setFormData({ ...formData, linkKey: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Modèle</Label>
              <Input
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Firmware</Label>
              <Input
                value={formData.firmware}
                onChange={(e) =>
                  setFormData({ ...formData, firmware: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Couleur</Label>
              <Input
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
              />
            </div>
            <div>
              <Checkbox
                label="Robot contrôlable"
                checked={formData.controllable}
                onChange={(e) =>
                  setFormData({ ...formData, controllable: e.target.checked })
                }
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="neon" onClick={handleSave} disabled={loading}>
                {loading
                  ? "Enregistrement..."
                  : isEdit
                  ? "Enregistrer"
                  : "Ajouter le robot"}
              </Button>
            </div>
          </div>
        )}

        {!isEdit && activeTab === "csv" && (
          <div className="flex flex-col gap-6 py-6">
            <p className="text-gray-300 text-sm text-center">
              Importez un fichier CSV contenant les informations des robots à
              ajouter.
            </p>

            <div className="flex justify-center">
              <Button
                variant="neon"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                📤 Importer un fichier CSV
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => handleCsvUpload(e.target.files?.[0])}
              />
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={handleCsvDownload}>
                📄 Télécharger le modèle CSV
              </Button>
            </div>

            {csvRobots.length > 0 && (
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-green-400">
                  ✅ {csvRobots.length} robots vont être ajoutés.
                </p>
                <Button onClick={handleCsvImportConfirm} disabled={loading}>
                  {loading ? "Import en cours..." : "Confirmer l’import"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
}
