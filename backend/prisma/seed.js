// prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const roles = [
  {
    name: 'superadmin',
    permissions: ['*'],
  },
  {
    name: 'admin',
    permissions: [
      'users:view',
      'users:edit',
      'robots:view',
      'robots:edit',
      'news:manage',
      'logs:view',
      'logs:manage',
    ],
  },
  {
    name: 'dev',
    permissions: ['robots:view', 'robots:edit', 'logs:view'],
  },
  {
    name: 'user',
    permissions: [],
  },
];

async function main() {
  console.log('🔄 Mise à jour des rôles...');
  for (const { name, permissions } of roles) {
    await prisma.role.upsert({
      where: { name },
      update: { permissions },
      create: { name, permissions },
    });
    console.log(`✅ Rôle prêt : ${name}`);
  }
}

main()
  .then(() => {
    console.log('🎉 Seed terminé');
    return prisma.$disconnect();
  })
  .catch((err) => {
    console.error('❌ Erreur dans le seed :', err);
    return prisma.$disconnect().finally(() => process.exit(1));
  });

