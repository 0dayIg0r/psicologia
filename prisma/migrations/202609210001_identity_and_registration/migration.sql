CREATE SCHEMA IF NOT EXISTS "app";
REVOKE ALL ON SCHEMA "app" FROM PUBLIC;

CREATE TYPE "app"."UserRole" AS ENUM ('PATIENT', 'PSYCHOLOGIST', 'ADMIN');
CREATE TYPE "app"."ConsentType" AS ENUM ('TERMS', 'PRIVACY');
CREATE TYPE "app"."CrpStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'INACTIVE');
CREATE TYPE "app"."PriceType" AS ENUM ('STANDARD', 'SOCIAL');
CREATE TYPE "app"."ThemeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE "app"."users" (
  "id" UUID NOT NULL,
  "name" VARCHAR(160) NOT NULL,
  "cpf" VARCHAR(11) NOT NULL,
  "email" VARCHAR(320) NOT NULL,
  "phone" VARCHAR(16) NOT NULL,
  "role" "app"."UserRole" NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "users_cpf_key" UNIQUE ("cpf"),
  CONSTRAINT "users_email_key" UNIQUE ("email"),
  CONSTRAINT "users_cpf_format_check" CHECK ("cpf" ~ '^[0-9]{11}$')
);

ALTER TABLE "app"."users"
  ADD CONSTRAINT "users_auth_user_id_fkey" FOREIGN KEY ("id")
  REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "app"."user_consents" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "type" "app"."ConsentType" NOT NULL,
  "document_version" VARCHAR(40) NOT NULL,
  "accepted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_consents_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "user_consents_user_id_type_document_version_key" UNIQUE ("user_id", "type", "document_version"),
  CONSTRAINT "user_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "user_consents_user_id_idx" ON "app"."user_consents"("user_id");

CREATE TABLE "app"."patient_profiles" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "patient_profiles_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "patient_profiles_user_id_key" UNIQUE ("user_id"),
  CONSTRAINT "patient_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "app"."psychologists" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "crp" VARCHAR(20) NOT NULL,
  "crp_status" "app"."CrpStatus" NOT NULL DEFAULT 'PENDING',
  "crp_verified_at" TIMESTAMPTZ(6),
  "bio" TEXT,
  "profile_image_url" TEXT,
  "appointment_duration_minutes" INTEGER NOT NULL DEFAULT 50,
  "offers_online" BOOLEAN NOT NULL DEFAULT false,
  "offers_in_person" BOOLEAN NOT NULL DEFAULT false,
  "offers_social" BOOLEAN NOT NULL DEFAULT false,
  "is_profile_public" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "psychologists_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "psychologists_user_id_key" UNIQUE ("user_id"),
  CONSTRAINT "psychologists_crp_key" UNIQUE ("crp"),
  CONSTRAINT "psychologists_duration_check" CHECK ("appointment_duration_minutes" > 0),
  CONSTRAINT "psychologists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "app"."psychologist_prices" (
  "id" UUID NOT NULL,
  "psychologist_id" UUID NOT NULL,
  "price_type" "app"."PriceType" NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "psychologist_prices_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "psychologist_prices_psychologist_id_price_type_key" UNIQUE ("psychologist_id", "price_type"),
  CONSTRAINT "psychologist_prices_amount_check" CHECK ("amount" >= 0),
  CONSTRAINT "psychologist_prices_psychologist_id_fkey" FOREIGN KEY ("psychologist_id") REFERENCES "app"."psychologists"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "psychologist_prices_psychologist_id_idx" ON "app"."psychologist_prices"("psychologist_id");

CREATE TABLE "app"."themes" (
  "id" UUID NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "slug" VARCHAR(120) NOT NULL,
  "status" "app"."ThemeStatus" NOT NULL DEFAULT 'PENDING',
  "created_by_psychologist_id" UUID,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "themes_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "themes_slug_key" UNIQUE ("slug"),
  CONSTRAINT "themes_creator_fkey" FOREIGN KEY ("created_by_psychologist_id") REFERENCES "app"."psychologists"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "themes_status_active_idx" ON "app"."themes"("status", "active");
CREATE INDEX "themes_created_by_psychologist_id_idx" ON "app"."themes"("created_by_psychologist_id");
CREATE UNIQUE INDEX "themes_normalized_name_key" ON "app"."themes" (lower(btrim("name")));

CREATE TABLE "app"."psychologist_themes" (
  "psychologist_id" UUID NOT NULL,
  "theme_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "psychologist_themes_pkey" PRIMARY KEY ("psychologist_id", "theme_id"),
  CONSTRAINT "psychologist_themes_psychologist_id_fkey" FOREIGN KEY ("psychologist_id") REFERENCES "app"."psychologists"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "psychologist_themes_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "app"."themes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "psychologist_themes_theme_id_idx" ON "app"."psychologist_themes"("theme_id");

CREATE TABLE "app"."specialties" (
  "id" UUID NOT NULL, "name" VARCHAR(100) NOT NULL, "slug" VARCHAR(120) NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true, "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "specialties_pkey" PRIMARY KEY ("id"), CONSTRAINT "specialties_slug_key" UNIQUE ("slug")
);
CREATE UNIQUE INDEX "specialties_normalized_name_key" ON "app"."specialties" (lower(btrim("name")));

CREATE TABLE "app"."psychologist_specialties" (
  "psychologist_id" UUID NOT NULL, "specialty_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "psychologist_specialties_pkey" PRIMARY KEY ("psychologist_id", "specialty_id"),
  CONSTRAINT "psychologist_specialties_psychologist_id_fkey" FOREIGN KEY ("psychologist_id") REFERENCES "app"."psychologists"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "psychologist_specialties_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "app"."specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "psychologist_specialties_specialty_id_idx" ON "app"."psychologist_specialties"("specialty_id");

CREATE TABLE "app"."insurance_providers" (
  "id" UUID NOT NULL, "name" VARCHAR(120) NOT NULL, "slug" VARCHAR(140) NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true, "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "insurance_providers_pkey" PRIMARY KEY ("id"), CONSTRAINT "insurance_providers_slug_key" UNIQUE ("slug")
);
CREATE UNIQUE INDEX "insurance_providers_normalized_name_key" ON "app"."insurance_providers" (lower(btrim("name")));

CREATE TABLE "app"."psychologist_insurance_providers" (
  "psychologist_id" UUID NOT NULL, "insurance_provider_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "psychologist_insurance_providers_pkey" PRIMARY KEY ("psychologist_id", "insurance_provider_id"),
  CONSTRAINT "psychologist_insurance_psychologist_id_fkey" FOREIGN KEY ("psychologist_id") REFERENCES "app"."psychologists"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "psychologist_insurance_provider_id_fkey" FOREIGN KEY ("insurance_provider_id") REFERENCES "app"."insurance_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "psychologist_insurance_provider_id_idx" ON "app"."psychologist_insurance_providers"("insurance_provider_id");

CREATE TABLE "app"."psychologist_addresses" (
  "id" UUID NOT NULL, "psychologist_id" UUID NOT NULL, "cep" VARCHAR(8) NOT NULL,
  "street" VARCHAR(180) NOT NULL, "number" VARCHAR(30) NOT NULL, "complement" VARCHAR(120),
  "neighborhood" VARCHAR(120) NOT NULL, "city" VARCHAR(120) NOT NULL, "state" CHAR(2) NOT NULL,
  "latitude" DECIMAL(9,6), "longitude" DECIMAL(9,6), "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "psychologist_addresses_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "psychologist_addresses_cep_check" CHECK ("cep" ~ '^[0-9]{8}$'),
  CONSTRAINT "psychologist_addresses_state_check" CHECK ("state" ~ '^[A-Z]{2}$'),
  CONSTRAINT "psychologist_addresses_psychologist_id_fkey" FOREIGN KEY ("psychologist_id") REFERENCES "app"."psychologists"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "psychologist_addresses_psychologist_id_idx" ON "app"."psychologist_addresses"("psychologist_id");
CREATE INDEX "psychologist_addresses_cep_idx" ON "app"."psychologist_addresses"("cep");
CREATE INDEX "psychologist_addresses_state_city_idx" ON "app"."psychologist_addresses"("state", "city");

REVOKE ALL ON ALL TABLES IN SCHEMA "app" FROM "anon", "authenticated";
