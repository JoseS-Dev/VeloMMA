-- CreateEnum
CREATE TYPE "BoutStatus" AS ENUM ('Programada', 'Cancelada', 'En_Proceso', 'Finalizada');

-- AlterTable
ALTER TABLE "bouts" ADD COLUMN     "status_bout" "BoutStatus" NOT NULL DEFAULT 'Programada';
