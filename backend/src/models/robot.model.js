import prisma from '../utils/db.js';

export const RobotModel = {
  /**
   * 🔍 Récupère tous les robots liés à un utilisateur
   * @param {string} userId
   * @returns {Promise<Robot[]>}
   */
  getByUserId: async (userId) => {
    return prisma.robot.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  },

  /**
   * 🔍 Récupère tous les robots (admin)
   * @returns {Promise<Robot[]>}
   */
  getAll: async () => {
    return prisma.robot.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  },

  /**
   * 🔍 Récupère un robot par ID
   * @param {string} id
   * @returns {Promise<Robot|null>}
   */
  getById: async (id) => {
    return prisma.robot.findUnique({
      where: { id },
    });
  },

  /**
   * 🔍 Récupère un robot par numéro de série
   * @param {string} serialNumber
   * @returns {Promise<Robot|null>}
   */
  getBySerialNumber: async (serialNumber) => {
    return prisma.robot.findUnique({
      where: { serialNumber },
    });
  },

  /**
   * ➕ Crée un nouveau robot
   * @param {object} data
   * @returns {Promise<Robot>}
   */
  create: async ({
    serialNumber,
    linkKey,
    firmware,
    color,
    controllable,
    model,
  }) => {
    return prisma.robot.create({
      data: {
        serialNumber,
        linkKey,
        firmware,
        color,
        controllable,
        model,
      },
    });
  },

  /**
   * 📝 Met à jour un robot existant
   * @param {string} id
   * @param {object} data
   * @returns {Promise<Robot>}
   */
  update: async (id, data) => {
    return prisma.robot.update({
      where: { id },
      data,
    });
  },

  /**
   * ❌ Supprime un robot
   * @param {string} id
   * @returns {Promise<Robot>}
   */
  delete: async (id) => {
    return prisma.robot.delete({
      where: { id },
    });
  },

  /**
   * 📤 Récupère tous les robots avec données prêtes à l’export (CSV)
   * @returns {Promise<object[]>}
   */
  getAllForExport: async () => {
    return prisma.robot.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        name: true,
        serialNumber: true,
        model: true,
        firmware: true,
        color: true,
        controllable: true,
        commissionedAt: true,
        createdAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  },
};
