-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Masculino', 'Femenino', 'Otro');

-- CreateEnum
CREATE TYPE "Stance" AS ENUM ('Orthodox', 'Southpaw', 'Switch', 'Open_Stance');

-- CreateEnum
CREATE TYPE "BoutResult" AS ENUM ('Win_Red', 'Win_Blue', 'Draw', 'No_Contest');

-- CreateEnum
CREATE TYPE "WinMethod" AS ENUM ('KO', 'TKO', 'Submission', 'Unanimous_Decision', 'Split_Decision', 'Majority_Decision', 'Doctor_Stoppage', 'Disqualification');

-- CreateEnum
CREATE TYPE "InjurySeverity" AS ENUM ('Menor', 'Moderado', 'Severo');

-- CreateTable
CREATE TABLE "fighters" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "nickname" TEXT,
    "slug" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3),
    "gender" "Gender",
    "nationality" TEXT,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "stance" "Stance",
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "fighters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fighter_injuries" (
    "id" SERIAL NOT NULL,
    "fighter_id" INTEGER NOT NULL,
    "description_injury" TEXT NOT NULL,
    "severity_injury" "InjurySeverity" NOT NULL,
    "injury_date" TIMESTAMP(3),
    "recovery_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "fighter_injuries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "divisions" (
    "id" SERIAL NOT NULL,
    "name_division" TEXT NOT NULL,
    "weight_class" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "divisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fighter_division" (
    "fighter_id" INTEGER NOT NULL,
    "division_id" INTEGER NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "name_team" TEXT NOT NULL,
    "description_team" TEXT,
    "date_founded" TIMESTAMP(3),
    "location" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fighter_teams" (
    "fighter_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "joined_date" TIMESTAMP(3),
    "left_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "name_event" TEXT NOT NULL,
    "date_event" TIMESTAMP(3) NOT NULL,
    "location_event" TEXT NOT NULL,
    "venue_event" TEXT,
    "octagon_size" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bouts" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "division_id" INTEGER NOT NULL,
    "red_corner_id" INTEGER NOT NULL,
    "blue_corner_id" INTEGER NOT NULL,
    "result" "BoutResult",
    "method" "WinMethod",
    "rounded_ended" INTEGER,
    "time_ended" TEXT,
    "referee" TEXT,
    "is_title_fight" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bout_metrics" (
    "id" SERIAL NOT NULL,
    "bout_id" INTEGER NOT NULL,
    "fighter_id" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "sig_strikes_landed" INTEGER NOT NULL DEFAULT 0,
    "sig_strikes_attempted" INTEGER NOT NULL DEFAULT 0,
    "total_strikes_landed" INTEGER NOT NULL DEFAULT 0,
    "total_strikes_attempted" INTEGER NOT NULL DEFAULT 0,
    "head_strikes_landed" INTEGER NOT NULL DEFAULT 0,
    "body_strikes_landed" INTEGER NOT NULL DEFAULT 0,
    "leg_strikes_landed" INTEGER NOT NULL DEFAULT 0,
    "takedowns_landed" INTEGER NOT NULL DEFAULT 0,
    "takedowns_attempted" INTEGER NOT NULL DEFAULT 0,
    "submissions_landed" INTEGER NOT NULL DEFAULT 0,
    "reversals" INTEGER NOT NULL DEFAULT 0,
    "control_time" INTEGER NOT NULL DEFAULT 0,
    "knockdowns" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bout_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bout_judges" (
    "id" SERIAL NOT NULL,
    "bout_id" INTEGER NOT NULL,
    "judge_name" TEXT NOT NULL,
    "red_score" INTEGER NOT NULL,
    "blue_score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bout_judges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bout_weigh_ins" (
    "id" SERIAL NOT NULL,
    "bout_id" INTEGER NOT NULL,
    "fighter_id" INTEGER NOT NULL,
    "weight_recorded" DOUBLE PRECISION NOT NULL,
    "missed_weight" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bout_weigh_ins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fighters_slug_key" ON "fighters"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "fighter_division_fighter_id_division_id_key" ON "fighter_division"("fighter_id", "division_id");

-- CreateIndex
CREATE UNIQUE INDEX "fighter_teams_fighter_id_team_id_key" ON "fighter_teams"("fighter_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "bout_metrics_bout_id_fighter_id_round_key" ON "bout_metrics"("bout_id", "fighter_id", "round");

-- CreateIndex
CREATE UNIQUE INDEX "bout_judges_bout_id_judge_name_key" ON "bout_judges"("bout_id", "judge_name");

-- CreateIndex
CREATE UNIQUE INDEX "bout_weigh_ins_bout_id_fighter_id_key" ON "bout_weigh_ins"("bout_id", "fighter_id");

-- AddForeignKey
ALTER TABLE "fighter_injuries" ADD CONSTRAINT "fighter_injuries_fighter_id_fkey" FOREIGN KEY ("fighter_id") REFERENCES "fighters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fighter_division" ADD CONSTRAINT "fighter_division_fighter_id_fkey" FOREIGN KEY ("fighter_id") REFERENCES "fighters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fighter_division" ADD CONSTRAINT "fighter_division_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "divisions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fighter_teams" ADD CONSTRAINT "fighter_teams_fighter_id_fkey" FOREIGN KEY ("fighter_id") REFERENCES "fighters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fighter_teams" ADD CONSTRAINT "fighter_teams_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bouts" ADD CONSTRAINT "bouts_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bouts" ADD CONSTRAINT "bouts_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "divisions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bouts" ADD CONSTRAINT "bouts_red_corner_id_fkey" FOREIGN KEY ("red_corner_id") REFERENCES "fighters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bouts" ADD CONSTRAINT "bouts_blue_corner_id_fkey" FOREIGN KEY ("blue_corner_id") REFERENCES "fighters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bout_metrics" ADD CONSTRAINT "bout_metrics_bout_id_fkey" FOREIGN KEY ("bout_id") REFERENCES "bouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bout_metrics" ADD CONSTRAINT "bout_metrics_fighter_id_fkey" FOREIGN KEY ("fighter_id") REFERENCES "fighters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bout_judges" ADD CONSTRAINT "bout_judges_bout_id_fkey" FOREIGN KEY ("bout_id") REFERENCES "bouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bout_weigh_ins" ADD CONSTRAINT "bout_weigh_ins_bout_id_fkey" FOREIGN KEY ("bout_id") REFERENCES "bouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bout_weigh_ins" ADD CONSTRAINT "bout_weigh_ins_fighter_id_fkey" FOREIGN KEY ("fighter_id") REFERENCES "fighters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
