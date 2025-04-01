import type {
  Robot,
  CreateRobotPayload,
  LinkRobotPayload,
  UpdateRobotPayload,
} from '../types/robot';

const BASE_URL = import.meta.env.VITE_API_URL;

/* ============================================================================
// Services qui gèrent les appels API
============================================================================ */

/**
 * 📝 Récupérer les robots de l'utilisateur
 */
export async function fetchRobots(): Promise<Robot[]> {
  const res = await fetch(`${BASE_URL}/robots`, { credentials: 'include' });
  if (!res.ok) throw new Error('Erreur lors du chargement des robots');
  return res.json();
}

/**
 * 🔍 Récupérer tous les robots (admin uniquement)
 */
export async function fetchAllRobots(): Promise<Robot[]> {
  const res = await fetch(`${BASE_URL}/robots/all`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erreur lors du chargement des robots (admin)');
  return res.json();
}

/**
 * 🔗 Lier un robot à un utilisateur
 */
export async function linkRobot(data: LinkRobotPayload): Promise<Robot> {
  const res = await fetch(`${BASE_URL}/robots/link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Erreur lors de la liaison du robot');
  return res.json();
}

/**
 * ➕ Ajouter un robot (admin uniquement)
 */
export async function createRobot(data: CreateRobotPayload): Promise<Robot> {
  const res = await fetch(`${BASE_URL}/robots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Erreur lors de la création du robot');
  return res.json();
}

/**
 * 📦 Ajouter plusieurs robots depuis un CSV (admin uniquement)
 */
export async function createMultipleRobots(
  data: CreateRobotPayload[]
): Promise<Robot[]> {
  const res = await fetch(`${BASE_URL}/robots/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Échec de l’import des robots");
  return res.json();
}

/**
 * 📝 Modifier un robot existant
 */
export async function updateRobot(
  id: string,
  data: UpdateRobotPayload
): Promise<Robot> {
  const res = await fetch(`${BASE_URL}/robots/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Erreur lors de la mise à jour du robot');
  return res.json();
}

/**
 * ❌ Supprimer un robot
 */
export async function deleteRobot(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/robots/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Erreur lors de la suppression du robot');
}
