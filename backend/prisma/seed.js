import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const basePermissions = [
  // Utilisateurs
  'view_users',
  'edit_users',
  'delete_users',

  // Robots
  'view_all_robots',

  // Actualités
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
];

async function main() {
  for (const name of basePermissions) {
    const exists = await prisma.permission.findUnique({ where: { name } });
    if (!exists) {
      await prisma.permission.create({ data: { name } });
      console.log(`✅ Ajout : ${name}`);
    } else {
      console.log(`ℹ️ Existe déjà : ${name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed permissions :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
