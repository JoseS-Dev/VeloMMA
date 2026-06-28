-- CreateEnum
CREATE TYPE "BonusType" AS ENUM ('Fight_of_the_night', 'Performance_of_the_night', 'Submission_of_the_night', 'Knockout_of_the_night');

-- CreateTable
CREATE TABLE "fighter_rankings" (
    "id" SERIAL NOT NULL,
    "fighter_id" INTEGER NOT NULL,
    "division_id" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "as_of_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "fighter_rankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bout_bonuses" (
    "id" SERIAL NOT NULL,
    "bout_id" INTEGER NOT NULL,
    "fighter_id" INTEGER NOT NULL,
    "bonus_type" "BonusType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bout_bonuses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fighter_rankings" ADD CONSTRAINT "fighter_rankings_fighter_id_fkey" FOREIGN KEY ("fighter_id") REFERENCES "fighters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fighter_rankings" ADD CONSTRAINT "fighter_rankings_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "divisions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bout_bonuses" ADD CONSTRAINT "bout_bonuses_bout_id_fkey" FOREIGN KEY ("bout_id") REFERENCES "bouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bout_bonuses" ADD CONSTRAINT "bout_bonuses_fighter_id_fkey" FOREIGN KEY ("fighter_id") REFERENCES "fighters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
