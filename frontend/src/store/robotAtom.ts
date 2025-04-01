import { atom } from 'jotai';
import * as robotService from '../services/robotService';
import type { Robot, LinkRobotPayload, CreateRobotPayload, UpdateRobotPayload } from '../types/robot';

/* ============================================================================
// Atom principal qui gère l'état de la liste des robots
============================================================================ */

export const robotsAtom = atom<Robot[]>([]);

/* ============================================================================
// Actions dérivées qui appellent les services
============================================================================ */

/**
 * 🔄 Recharger tous les robots de l'utilisateur
 */
export const fetchRobotsAtom = atom(null, async (_, set) => {
  try {
    const robots = await robotService.fetchRobots();
    set(robotsAtom, robots);
  } catch (error) {
    console.error('Erreur lors du chargement des robots:', error);
  }
});

/**
 * 🔗 Lier un robot
 */
export const linkRobotAtom = atom(
  null,
  async (get, set, payload: LinkRobotPayload) => {
    try {
      const linkedRobot = await robotService.linkRobot(payload);
      set(robotsAtom, [...get(robotsAtom), linkedRobot]);
    } catch (error) {
      console.error('Erreur lors de la liaison du robot:', error);
    }
  }
);

/**
 * ➕ Ajouter un robot
 */
export const addRobotAtom = atom(
  null,
  async (get, set, robotData: CreateRobotPayload) => {
    try {
      const newRobot = await robotService.createRobot(robotData);
      set(robotsAtom, [...get(robotsAtom), newRobot]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du robot:', error);
    }
  }
);

/**
 * 📝 Mettre à jour un robot existant
 */
export const updateRobotAtom = atom(
  null,
  async (get, set, { id, data }: { id: string, data: UpdateRobotPayload }) => {
    try {
      const updatedRobot = await robotService.updateRobot(id, data);
      set(robotsAtom, get(robotsAtom).map(r => r.id === id ? updatedRobot : r));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du robot:', error);
    }
  }
);

/**
 * ❌ Supprimer un robot
 */
export const deleteRobotAtom = atom(
  null,
  async (get, set, id: string) => {
    try {
      await robotService.deleteRobot(id);
      set(robotsAtom, get(robotsAtom).filter(r => r.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du robot:', error);
    }
  }
);

import { fetchAllRobots } from '../services/robotService';

export const fetchAllRobotsAtom = atom(null, async (_, set) => {
  const all = await fetchAllRobots();
  set(robotsAtom, all);
});
