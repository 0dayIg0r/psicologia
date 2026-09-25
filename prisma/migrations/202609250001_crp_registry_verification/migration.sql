ALTER TABLE "app"."psychologists"
  ADD COLUMN "crp_registry_code" VARCHAR(128);

CREATE UNIQUE INDEX "psychologists_crp_registry_code_key"
  ON "app"."psychologists"("crp_registry_code");
