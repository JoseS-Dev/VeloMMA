-- AlterTable
ALTER TABLE "fighter_division" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "fighter_division_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "fighter_teams" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "fighter_teams_pkey" PRIMARY KEY ("id");
