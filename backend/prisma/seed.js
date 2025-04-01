// prisma/seed.js
import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

const rolesToCreate = [
  RoleName.user,
  RoleName.admin,
  RoleName.superadmin,
  RoleName.technicien,
];

async function main() {
  for (const name of rolesToCreate) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: {
        name,
      },
    });
    console.log(`✅ Rôle créé ou déjà existant : ${name}`);
  }
}

main()
  .then(() => {
    console.log('🎉 Seed terminé');
    prisma.$disconnect();
  })
  .catch((err) => {
    console.error('❌ Erreur dans le seed :', err);
    prisma.$disconnect();
    process.exit(1);
  });
