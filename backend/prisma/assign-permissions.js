import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ROLE_PERMISSIONS = {
  superadmin: [
    // Utilisateurs
    'view_users',
    'edit_users',
    'delete_users',

    // Robots
    'view_all_robots',

    // News
    'create_news',
    'edit_news',
    'delete_news',

    // Firmwares
    'upload_firmwares',

    // Rôles
    'view_roles',
    'create_role',
    'edit_roles',
    'delete_roles',

    // Permissions
    'view_permissions',
    'create_permission',
    'edit_permission',
    'delete_permission',
  ],
  admin: [
    'view_users',
    'edit_users',
    'view_all_robots',
    'create_news',
    'edit_news',
    'upload_firmwares',
    'view_roles',
    'view_permissions',
  ],
  dev: [
    'view_all_robots',
    'upload_firmwares',
    'create_news',
    'edit_news',
  ],
  user: [
    'view_all_robots',
  ],
};

async function assignPermissionsToRoles() {
  for (const [roleName, permNames] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.findFirst({ where: { name: roleName } });
    if (!role) {
      console.warn(`⚠️ Rôle "${roleName}" introuvable`);
      continue;
    }

    const connectPermissions = permNames.map((name) => ({ name }));

    await prisma.role.update({
      where: { id: role.id },
      data: {
        permissions: {
          set: [], // reset avant ajout
          connect: connectPermissions,
        },
      },
    });

    console.log(`✅ Rôle "${roleName}" mis à jour avec ${permNames.length} permissions`);
  }
}

assignPermissionsToRoles()
  .catch((err) => {
    console.error('❌ Erreur attribution permissions :', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
