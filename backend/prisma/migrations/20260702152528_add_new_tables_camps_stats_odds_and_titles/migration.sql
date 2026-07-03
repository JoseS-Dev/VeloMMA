/*
  Warnings:

  - The `time_ended` column on the `bouts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TitleType" AS ENUM ('Undisputed', 'Interino', 'Vacante');

-- CreateEnum
CREATE TYPE "SubmissionType" AS ENUM ('Rear_Naked_Choke', 'Guillotine_Choke', 'Armbar', 'Triangle_Choke', 'Kimura', 'Americana', 'Ankle_Lock', 'Heel_Hook', 'Kneebar', 'Wrist_Lock', 'Other');

-- AlterTable
ALTER TABLE "bout_metrics" ADD COLUMN     "body_strikes_attempted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "clinch_strikes_attempted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "clinch_strikes_landed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "distance_strikes_attempted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "distance_strikes_landed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ground_strikes_attempted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ground_strikes_landed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "head_strikes_attempted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "leg_strikes_attempted" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "bouts" ADD COLUMN     "submission_type" "SubmissionType",
ADD COLUMN     "upset" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "time_ended",
ADD COLUMN     "time_ended" INTEGER;

-- AlterTable
ALTER TABLE "fighters" ADD COLUMN     "reach" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "fighter_titles" (
    "id" SERIAL NOT NULL,
    "division_id" INTEGER NOT NULL,
    "fighter_id" INTEGER NOT NULL,
    "title_type" "TitleType" NOT NULL DEFAULT 'Undisputed',
    "won_date" TIMESTAMP(3) NOT NULL,
    "lost_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "fighter_titles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bout_odds" (
    "id" SERIAL NOT NULL,
    "bout_id" INTEGER NOT NULL,
    "red_opening_odds" DOUBLE PRECISION NOT NULL,
    "blue_opening_odds" DOUBLE PRECISION NOT NULL,
    "red_closing_odds" DOUBLE PRECISION NOT NULL,
    "blue_closing_odds" DOUBLE PRECISION NOT NULL,
    "provider" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bout_odds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_camps" (
    "id" SERIAL NOT NULL,
    "bout_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "fighter_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "training_camps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fighter_stats" (
    "id" SERIAL NOT NULL,
    "fighter_id" INTEGER NOT NULL,
    "sig_strikes_accuracy" DOUBLE PRECISION NOT NULL,
    "sig_strikes_absorbed_pm" DOUBLE PRECISION NOT NULL,
    "takedown_accuracy" DOUBLE PRECISION NOT NULL,
    "takedown_defense" DOUBLE PRECISION NOT NULL,
    "average_fight_time" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "fighter_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "training_camps_bout_id_fighter_id_key" ON "training_camps"("bout_id", "fighter_id");

-- CreateIndex
CREATE UNIQUE INDEX "fighter_stats_fighter_id_key" ON "fighter_stats"("fighter_id");

-- AddForeignKey
ALTER TABLE "fighter_titles" ADD CONSTRAINT "fighter_titles_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "divisions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fighter_titles" ADD CONSTRAINT "fighter_titles_fighter_id_fkey" FOREIGN KEY ("fighter_id") REFERENCES "fighters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bout_odds" ADD CONSTRAINT "bout_odds_bout_id_fkey" FOREIGN KEY ("bout_id") REFERENCES "bouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_camps" ADD CONSTRAINT "training_camps_bout_id_fkey" FOREIGN KEY ("bout_id") REFERENCES "bouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_camps" ADD CONSTRAINT "training_camps_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_camps" ADD CONSTRAINT "training_camps_fighter_id_fkey" FOREIGN KEY ("fighter_id") REFERENCES "fighters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fighter_stats" ADD CONSTRAINT "fighter_stats_fighter_id_fkey" FOREIGN KEY ("fighter_id") REFERENCES "fighters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
