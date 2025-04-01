import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Robot } from "../../../types/robot";
import { Button } from "../../ui";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { fr } from "date-fns/locale";

type Props = {
  robots: Robot[];
  onEdit?: (robot: Robot) => void;
  onDelete?: (robot: Robot) => void;
  onAdd?: () => void;
};

export default function RobotAdminTable({ robots, onEdit, onDelete, onAdd }: Props) {
  const [sortKey, setSortKey] = useState<keyof Robot>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const handleSort = (key: keyof Robot) => {
    if (key === sortKey) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sorted = [...robots].sort((a, b) => {
    const aVal = a[sortKey] ?? "";
    const bVal = b[sortKey] ?? "";
    return sortOrder === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const paginated = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      {/* Header avec bouton */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Liste des robots</h2>
        {onAdd && (
          <Button onClick={onAdd} variant="neon">
            <Plus size={16} /> Ajouter un robot
          </Button>
        )}
      </div>

      {/* Tableau */}
      <div className="overflow-auto rounded-xl border border-[#2a2a2a] bg-[#1e1e1e]">
        <table className="w-full text-sm text-left rounded-xl overflow-hidden">
        <thead className="bg-[#2a2a2a] text-white">
          <tr>
            <th className="px-4 py-3">
              <button
                type="button"
                className="w-full text-left cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Nom
              </button>
            </th>
            <th className="px-4 py-3">
              <button
                type="button"
                className="w-full text-left cursor-pointer"
                onClick={() => handleSort("serialNumber")}
              >
                N° de série
              </button>
            </th>
            <th className="px-4 py-3">Clé</th>
            <th className="px-4 py-3">Utilisateur</th>
            <th className="px-4 py-3">
              <button
                type="button"
                className="w-full text-left cursor-pointer"
                onClick={() => handleSort("firmware")}
              >
                Firmware
              </button>
            </th>
            <th className="px-4 py-3">Contrôlable</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3">Mise en service</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
          <tbody className="text-white divide-y divide-[#2a2a2a]">
            {paginated.map((robot) => (
              <tr key={robot.id} className="hover:bg-[#242424] transition-colors">
                <td className="px-4 py-3">{robot.name || <i className="text-gray-500">Sans nom</i>}</td>
                <td className="px-4 py-3 font-mono text-xs">{robot.serialNumber}</td>
                <td className="px-4 py-3 font-mono text-xs">{robot.linkKey}</td>
                <td className="px-4 py-3">
                  {robot.user ? `${robot.user.firstName} ${robot.user.lastName}` : <i className="text-gray-500">Non lié</i>}
                </td>
                <td className="px-4 py-3">{robot.firmware || <i className="text-gray-500">N/A</i>}</td>
                <td className="px-4 py-3">
                  <span className={robot.controllable ? "text-green-400" : "text-red-400"}>
                    {robot.controllable ? "Oui" : "Non"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={robot.status === "online" ? "text-green-400" : "text-red-400"}>
                    {robot.status || "offline"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {robot.commissionedAt ? (
                    formatDistanceToNow(new Date(robot.commissionedAt), { locale: fr, addSuffix: true })
                  ) : (
                    <i className="text-gray-500">Non renseigné</i>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(robot)}
                        title="Modifier"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(robot)}
                        title="Supprimer"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {pages.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
              className={`w-8 h-8 rounded-md text-sm font-semibold ${
                pageNumber === page
                  ? "bg-[#00aaff] text-black"
                  : "bg-[#2a2a2a] text-white hover:bg-[#00aaff]/20"
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
