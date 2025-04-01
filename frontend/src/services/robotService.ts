import { Robot, CreateRobotPayload, LinkRobotPayload, UpdateRobotPayload } from '../types/robot';

const BASE_URL = 'http://localhost:5000';

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
 * ➕ Ajouter un robot
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
 * 📝 Modifier un robot existant
 */
export async function updateRobot(id: string, data: UpdateRobotPayload): Promise<Robot> {
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
