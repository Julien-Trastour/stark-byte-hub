import { Trash, Pencil } from "lucide-react";
import type { User } from "../../../types/user";
import { Button } from "../../ui";

type Props = {
  title?: string;
  users: User[];
  onDelete: (id: string) => void;
  onEdit: (user: User) => void;
};

export default function UsersTable({ title, users, onDelete, onEdit }: Props) {
  if (users.length === 0) return null;

  return (
    <section className="space-y-4">
      {title && <h2 className="text-xl font-semibold text-[#00aaff]">{title}</h2>}

      <div className="overflow-x-auto rounded-xl border border-[#2a2a2a]">
        <table className="w-full text-sm text-white">
          <thead className="bg-[#2a2a2a] text-left text-gray-300">
            <tr>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Rôle</th>
              <th className="px-4 py-2">Créé le</th>
              <th className="px-4 py-2">Modifié le</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-[#2a2a2a] hover:bg-[#ffffff05]">
                <td className="px-4 py-2">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-2 text-gray-300">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role?.name}</td>
                <td className="px-4 py-2 text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                </td>
				<td className="px-4 py-2 text-gray-400">
				  {user.updatedAt
					? `${new Date(user.updatedAt).toLocaleDateString("fr-FR")} à ${new Date(user.updatedAt).toLocaleTimeString("fr-FR", {
						hour: "2-digit",
						minute: "2-digit",
					})}`
					: "—"}
				</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[#00aaff] border-[#00aaff]/40"
                      onClick={() => onEdit(user)}
                    >
                      <Pencil size={14} className="mr-1" />
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-400 border-red-400/40"
                      onClick={() => onDelete(user.id)}
                    >
                      <Trash size={14} className="mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
