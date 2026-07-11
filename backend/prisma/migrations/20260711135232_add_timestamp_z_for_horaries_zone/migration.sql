-- AlterTable
ALTER TABLE "events" ALTER COLUMN "date_event" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "fighter_injuries" ALTER COLUMN "injury_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "recovery_date" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "fighter_rankings" ALTER COLUMN "as_of_date" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "fighter_teams" ALTER COLUMN "joined_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "left_date" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "fighter_titles" ALTER COLUMN "won_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "lost_date" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "fighters" ALTER COLUMN "birth_date" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "teams" ALTER COLUMN "date_founded" SET DATA TYPE TIMESTAMPTZ(6);
