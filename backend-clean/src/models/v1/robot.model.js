import prisma from '../../utils/db.js';

export const RobotModel = {
  /**
   * 🔍 Récupère tous les robots liés à un utilisateur
   * @param {string} userId
   * @returns {Promise<Robot[]>}
   */
  getByUserId: (userId) => {
    return prisma.robot.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  },

  /**
   * 🔍 Récupère tous les robots (admin)
   * @returns {Promise<Robot[]>}
   */
  getAll: () => {
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
  getById: (id) => {
    return prisma.robot.findUnique({
      where: { id },
    });
  },

  /**
   * 🔍 Récupère un robot par numéro de série
   * @param {string} serialNumber
   * @returns {Promise<Robot|null>}
   */
  getBySerialNumber: (serialNumber) => {
    return prisma.robot.findUnique({
      where: { serialNumber },
    });
  },

  /**
   * ➕ Crée un nouveau robot (admin)
   * @param {object} data
   * @param {string} data.serialNumber
   * @param {string} data.linkKey
   * @param {string} data.firmware
   * @param {string} data.color
   * @param {boolean} data.controllable
   * @param {string} data.model
   * @returns {Promise<Robot>}
   */
  create: (data) => {
    return prisma.robot.create({ data });
  },

  /**
   * 📝 Met à jour un robot existant
   * @param {string} id
   * @param {object} data
   * @returns {Promise<Robot>}
   */
  update: (id, data) => {
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
  delete: (id) => {
    return prisma.robot.delete({
      where: { id },
    });
  },

  /**
   * 📤 Prépare les données des robots pour export CSV
   * @returns {Promise<object[]>}
   */
  getAllForExport: () => {
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
