import { useEffect, useState } from "react";
import { Cpu, Plus } from "lucide-react";
import { useAtom, useSetAtom } from "jotai";
import {
  robotsAtom,
  fetchAllRobotsAtom,
  deleteRobotAtom,
} from "../../store/robotAtom";
import { Button, Input } from "../../components/ui";
import { ConfirmDialog } from "../../components/common/Confirm-dialog";
import RobotAdminModal from "../../components/admin/robots/RobotAdminModal";
import RobotAdminTable from "../../components/admin/robots/RobotAdminTable";
import type { Robot } from "../../types/robot";

export default function AdminRobots() {
  const [robots] = useAtom(robotsAtom);
  const fetchRobots = useSetAtom(fetchAllRobotsAtom);
  const deleteRobot = useSetAtom(deleteRobotAtom);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [robotToEdit, setRobotToEdit] = useState<Robot | null>(null);
  const [robotToDelete, setRobotToDelete] = useState<Robot | null>(null);

  useEffect(() => {
    fetchRobots();
  }, [fetchRobots]);

  const filtered = robots.filter(
    (r) =>
      r.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.firmware?.toLowerCase().includes(search.toLowerCase()) ||
      r.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Cpu size={24} /> Gestion des robots
        </h1>
        <Button variant="neon" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Ajouter un robot
        </Button>
      </div>

      {/* Barre de recherche */}
      <Input
        placeholder="Rechercher un robot par nom, numéro de série ou firmware..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-md"
      />

      {/* Tableau des robots */}
      <RobotAdminTable
        robots={filtered}
        onEdit={(robot) => setRobotToEdit(robot)}
        onDelete={(robot) => setRobotToDelete(robot)}
      />

      {/* Modal d'ajout ou de modification */}
      {(showModal || robotToEdit) && (
        <RobotAdminModal
          onClose={() => {
            setShowModal(false);
            setRobotToEdit(null);
          }}
          onRefresh={fetchRobots}
          robot={robotToEdit || undefined}
        />
      )}

      {/* Dialog de suppression */}
      {robotToDelete && (
        <ConfirmDialog
          title="Supprimer ce robot ?"
          description={`Êtes-vous sûr de vouloir supprimer le robot « ${
            robotToDelete.name || robotToDelete.serialNumber
          } » ? Cette action est irréversible.`}
          onConfirm={async () => {
            await deleteRobot(robotToDelete.id);
            setRobotToDelete(null);
          }}
          onCancel={() => setRobotToDelete(null)}
        />
      )}
    </div>
  );
}
