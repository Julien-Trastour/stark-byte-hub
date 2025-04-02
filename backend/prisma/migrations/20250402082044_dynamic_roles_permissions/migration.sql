/*
  Warnings:

  - Changed the type of `name` on the `Role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- Ajouter la colonne permissions
ALTER TABLE "Role" ADD COLUMN "permissions" TEXT[];

-- Convertir "name" de enum vers text
ALTER TABLE "Role" ALTER COLUMN "name" TYPE TEXT USING "name"::text;

-- Supprimer l'ancien enum
DROP TYPE "RoleName";
