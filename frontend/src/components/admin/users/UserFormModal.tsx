import { useEffect, useState } from "react";
import type { User } from "../../../types/user";
import type { Role } from "../../../types/role";
import { useCreateUser, useUpdateUser } from "../../../hooks/useUsers";
import { useRoles } from "../../../hooks/useRoles";
import { Dialog, Input, Label, Button, Select } from "../../ui";

type Props = {
  user: User | null;
  onClose: () => void;
};

export default function UserFormModal({ user, onClose }: Props) {
  const isEdit = !!user;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const { data: roles = [] } = useRoles();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setRoleId(user.role?.id || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { firstName, lastName, email, roleId };

    try {
      if (isEdit && user) {
        await updateUser.mutateAsync({ id: user.id, data: payload });
      } else {
        await createUser.mutateAsync(payload);
      }
      onClose();
    } catch (err) {
      console.error("Erreur lors de l'envoi du formulaire :", err);
    }
  };

  return (
    <Dialog onClose={onClose}>
      <div className="w-full max-w-xl rounded-lg border-l-4 border-[#00aaff]/30 bg-[#1e1e1e] p-6 shadow-lg shadow-[#00aaff]/10 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
          aria-label="Fermer"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white">
          {isEdit ? "Modifier l’utilisateur" : "Ajouter un utilisateur"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Rôle</Label>
            <Select
              id="role"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
            >
              <option value="" disabled>
                -- Sélectionner un rôle --
              </option>
              {roles.map((role: Role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="neon">
              {isEdit ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
