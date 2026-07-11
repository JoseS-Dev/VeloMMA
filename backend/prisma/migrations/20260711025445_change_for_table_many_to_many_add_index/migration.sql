-- CreateIndex
CREATE INDEX "bout_bonuses_bout_id_fighter_id_idx" ON "bout_bonuses"("bout_id", "fighter_id");

-- CreateIndex
CREATE INDEX "bout_metrics_bout_id_fighter_id_idx" ON "bout_metrics"("bout_id", "fighter_id");

-- CreateIndex
CREATE INDEX "bout_weigh_ins_bout_id_fighter_id_idx" ON "bout_weigh_ins"("bout_id", "fighter_id");

-- CreateIndex
CREATE INDEX "bouts_event_id_division_id_idx" ON "bouts"("event_id", "division_id");

-- CreateIndex
CREATE INDEX "fighter_division_fighter_id_division_id_idx" ON "fighter_division"("fighter_id", "division_id");

-- CreateIndex
CREATE INDEX "fighter_rankings_fighter_id_division_id_idx" ON "fighter_rankings"("fighter_id", "division_id");

-- CreateIndex
CREATE INDEX "fighter_teams_fighter_id_team_id_idx" ON "fighter_teams"("fighter_id", "team_id");

-- CreateIndex
CREATE INDEX "fighter_titles_division_id_fighter_id_idx" ON "fighter_titles"("division_id", "fighter_id");

-- CreateIndex
CREATE INDEX "training_camps_bout_id_fighter_id_team_id_idx" ON "training_camps"("bout_id", "fighter_id", "team_id");
