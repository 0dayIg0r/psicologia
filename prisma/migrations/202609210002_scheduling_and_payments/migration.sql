CREATE TYPE "app"."AppointmentType" AS ENUM ('ONLINE', 'IN_PERSON', 'BOTH');
CREATE TYPE "app"."AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED', 'NO_SHOW');
CREATE TYPE "app"."PaymentProvider" AS ENUM ('MERCADO_PAGO');
CREATE TYPE "app"."PaymentMethod" AS ENUM ('PIX', 'CARD');
CREATE TYPE "app"."PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'APPROVED', 'REJECTED', 'CANCELED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'CHARGEBACK');
CREATE TYPE "app"."RefundStatus" AS ENUM ('PENDING', 'PROCESSING', 'APPROVED', 'REJECTED', 'CANCELED');
CREATE TYPE "app"."ReviewStatus" AS ENUM ('PENDING', 'PUBLISHED', 'HIDDEN', 'REMOVED');
CREATE TYPE "app"."Weekday" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

CREATE TABLE "app"."psychologist_availability" (
  "id" UUID NOT NULL, "psychologist_id" UUID NOT NULL, "weekday" "app"."Weekday" NOT NULL,
  "start_time" TIME(0) NOT NULL, "end_time" TIME(0) NOT NULL,
  "appointment_type" "app"."AppointmentType" NOT NULL, "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "psychologist_availability_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "psychologist_availability_time_check" CHECK ("end_time" > "start_time"),
  CONSTRAINT "psychologist_availability_psychologist_id_fkey" FOREIGN KEY ("psychologist_id") REFERENCES "app"."psychologists"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "psychologist_availability_lookup_idx" ON "app"."psychologist_availability"("psychologist_id", "weekday", "active");

CREATE TABLE "app"."external_patients" (
  "id" UUID NOT NULL, "psychologist_id" UUID NOT NULL, "name" VARCHAR(160) NOT NULL,
  "email" VARCHAR(320), "phone" VARCHAR(16), "administrative_notes" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "external_patients_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "external_patients_psychologist_id_fkey" FOREIGN KEY ("psychologist_id") REFERENCES "app"."psychologists"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "external_patients_psychologist_id_idx" ON "app"."external_patients"("psychologist_id");

CREATE TABLE "app"."appointments" (
  "id" UUID NOT NULL, "psychologist_id" UUID NOT NULL, "patient_user_id" UUID,
  "external_patient_id" UUID, "appointment_type" "app"."AppointmentType" NOT NULL,
  "price_type" "app"."PriceType" NOT NULL, "price_amount" DECIMAL(10,2) NOT NULL,
  "scheduled_start" TIMESTAMPTZ(6) NOT NULL, "scheduled_end" TIMESTAMPTZ(6) NOT NULL,
  "status" "app"."AppointmentStatus" NOT NULL DEFAULT 'PENDING', "created_by_user_id" UUID NOT NULL,
  "canceled_at" TIMESTAMPTZ(6), "cancellation_reason" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "appointments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "appointments_exactly_one_patient_check" CHECK (num_nonnulls("patient_user_id", "external_patient_id") = 1),
  CONSTRAINT "appointments_price_amount_check" CHECK ("price_amount" >= 0),
  CONSTRAINT "appointments_schedule_check" CHECK ("scheduled_end" > "scheduled_start"),
  CONSTRAINT "appointments_psychologist_id_fkey" FOREIGN KEY ("psychologist_id") REFERENCES "app"."psychologists"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "appointments_patient_user_id_fkey" FOREIGN KEY ("patient_user_id") REFERENCES "app"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "appointments_external_patient_id_fkey" FOREIGN KEY ("external_patient_id") REFERENCES "app"."external_patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "appointments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "app"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "appointments_psychologist_scheduled_start_idx" ON "app"."appointments"("psychologist_id", "scheduled_start");
CREATE INDEX "appointments_patient_scheduled_start_idx" ON "app"."appointments"("patient_user_id", "scheduled_start");
CREATE INDEX "appointments_external_patient_id_idx" ON "app"."appointments"("external_patient_id");
CREATE INDEX "appointments_created_by_user_id_idx" ON "app"."appointments"("created_by_user_id");
CREATE INDEX "appointments_status_scheduled_start_idx" ON "app"."appointments"("status", "scheduled_start");

CREATE FUNCTION "app"."protect_appointment_price_snapshot"() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF NEW."price_type" IS DISTINCT FROM OLD."price_type"
     OR NEW."price_amount" IS DISTINCT FROM OLD."price_amount" THEN
    RAISE EXCEPTION 'appointment price snapshot cannot be changed';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER "appointments_price_snapshot_immutable"
BEFORE UPDATE ON "app"."appointments" FOR EACH ROW
EXECUTE FUNCTION "app"."protect_appointment_price_snapshot"();

CREATE TABLE "app"."payments" (
  "id" UUID NOT NULL, "appointment_id" UUID NOT NULL, "provider" "app"."PaymentProvider" NOT NULL,
  "provider_payment_id" VARCHAR(160), "payment_method" "app"."PaymentMethod" NOT NULL,
  "status" "app"."PaymentStatus" NOT NULL DEFAULT 'PENDING', "gross_amount" DECIMAL(10,2) NOT NULL,
  "platform_fee_rate" DECIMAL(6,5) NOT NULL DEFAULT 0.05000,
  "platform_fee_amount" DECIMAL(10,2) NOT NULL, "psychologist_amount" DECIMAL(10,2) NOT NULL,
  "provider_fee_amount" DECIMAL(10,2) NOT NULL DEFAULT 0, "currency" CHAR(3) NOT NULL DEFAULT 'BRL',
  "paid_at" TIMESTAMPTZ(6), "expires_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "payments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payments_provider_provider_payment_id_key" UNIQUE ("provider", "provider_payment_id"),
  CONSTRAINT "payments_amounts_nonnegative_check" CHECK ("gross_amount" >= 0 AND "platform_fee_amount" >= 0 AND "psychologist_amount" >= 0 AND "provider_fee_amount" >= 0),
  CONSTRAINT "payments_fee_rate_check" CHECK ("platform_fee_rate" >= 0 AND "platform_fee_rate" <= 1),
  CONSTRAINT "payments_split_check" CHECK ("platform_fee_amount" + "psychologist_amount" = "gross_amount"),
  CONSTRAINT "payments_provider_fee_check" CHECK ("provider_fee_amount" <= "gross_amount"),
  CONSTRAINT "payments_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "app"."appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "payments_appointment_id_idx" ON "app"."payments"("appointment_id");
CREATE INDEX "payments_status_created_at_idx" ON "app"."payments"("status", "created_at");

CREATE FUNCTION "app"."protect_payment_split_snapshot"() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF NEW."gross_amount" IS DISTINCT FROM OLD."gross_amount"
     OR NEW."platform_fee_rate" IS DISTINCT FROM OLD."platform_fee_rate"
     OR NEW."platform_fee_amount" IS DISTINCT FROM OLD."platform_fee_amount"
     OR NEW."psychologist_amount" IS DISTINCT FROM OLD."psychologist_amount"
     OR NEW."currency" IS DISTINCT FROM OLD."currency" THEN
    RAISE EXCEPTION 'payment split snapshot cannot be changed';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER "payments_split_snapshot_immutable"
BEFORE UPDATE ON "app"."payments" FOR EACH ROW
EXECUTE FUNCTION "app"."protect_payment_split_snapshot"();

CREATE TABLE "app"."pix_payments" (
  "payment_id" UUID NOT NULL, "qr_code_text" TEXT, "expires_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "pix_payments_pkey" PRIMARY KEY ("payment_id"),
  CONSTRAINT "pix_payments_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "app"."payments"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "app"."card_payment_metadata" (
  "payment_id" UUID NOT NULL, "brand" VARCHAR(40), "last_four" CHAR(4), "installments" INTEGER,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "card_payment_metadata_pkey" PRIMARY KEY ("payment_id"),
  CONSTRAINT "card_payment_metadata_last_four_check" CHECK ("last_four" IS NULL OR "last_four" ~ '^[0-9]{4}$'),
  CONSTRAINT "card_payment_metadata_installments_check" CHECK ("installments" IS NULL OR "installments" > 0),
  CONSTRAINT "card_payment_metadata_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "app"."payments"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "app"."psychologist_payment_accounts" (
  "id" UUID NOT NULL, "psychologist_id" UUID NOT NULL, "provider" "app"."PaymentProvider" NOT NULL,
  "provider_account_id" VARCHAR(160), "connected" BOOLEAN NOT NULL DEFAULT false,
  "connected_at" TIMESTAMPTZ(6), "disconnected_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "psychologist_payment_accounts_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "psychologist_payment_accounts_psychologist_id_provider_key" UNIQUE ("psychologist_id", "provider"),
  CONSTRAINT "psychologist_payment_accounts_psychologist_id_fkey" FOREIGN KEY ("psychologist_id") REFERENCES "app"."psychologists"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "psychologist_payment_accounts_psychologist_id_idx" ON "app"."psychologist_payment_accounts"("psychologist_id");

CREATE TABLE "app"."payment_webhook_events" (
  "id" UUID NOT NULL, "provider" "app"."PaymentProvider" NOT NULL, "provider_event_id" VARCHAR(160),
  "event_type" VARCHAR(120) NOT NULL, "provider_payment_id" VARCHAR(160), "processed" BOOLEAN NOT NULL DEFAULT false,
  "processed_at" TIMESTAMPTZ(6), "received_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "payment_webhook_events_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payment_webhook_events_provider_provider_event_id_key" UNIQUE ("provider", "provider_event_id")
);
CREATE INDEX "payment_webhook_events_processed_received_at_idx" ON "app"."payment_webhook_events"("processed", "received_at");
CREATE INDEX "payment_webhook_events_provider_payment_idx" ON "app"."payment_webhook_events"("provider", "provider_payment_id");

CREATE TABLE "app"."refunds" (
  "id" UUID NOT NULL, "payment_id" UUID NOT NULL, "provider_refund_id" VARCHAR(160) NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL, "status" "app"."RefundStatus" NOT NULL DEFAULT 'PENDING',
  "reason" TEXT, "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "processed_at" TIMESTAMPTZ(6),
  CONSTRAINT "refunds_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "refunds_payment_id_provider_refund_id_key" UNIQUE ("payment_id", "provider_refund_id"),
  CONSTRAINT "refunds_amount_check" CHECK ("amount" >= 0),
  CONSTRAINT "refunds_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "app"."payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "refunds_payment_id_idx" ON "app"."refunds"("payment_id");

CREATE TABLE "app"."psychologist_reviews" (
  "id" UUID NOT NULL, "psychologist_id" UUID NOT NULL, "patient_user_id" UUID NOT NULL,
  "appointment_id" UUID NOT NULL, "rating" INTEGER NOT NULL, "comment" TEXT,
  "status" "app"."ReviewStatus" NOT NULL DEFAULT 'PENDING',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "psychologist_reviews_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "psychologist_reviews_appointment_id_key" UNIQUE ("appointment_id"),
  CONSTRAINT "psychologist_reviews_rating_check" CHECK ("rating" BETWEEN 1 AND 5),
  CONSTRAINT "psychologist_reviews_psychologist_id_fkey" FOREIGN KEY ("psychologist_id") REFERENCES "app"."psychologists"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "psychologist_reviews_patient_user_id_fkey" FOREIGN KEY ("patient_user_id") REFERENCES "app"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "psychologist_reviews_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "app"."appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "psychologist_reviews_psychologist_status_idx" ON "app"."psychologist_reviews"("psychologist_id", "status");
CREATE INDEX "psychologist_reviews_patient_user_id_idx" ON "app"."psychologist_reviews"("patient_user_id");

CREATE TABLE "app"."favorites" (
  "user_id" UUID NOT NULL, "psychologist_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "favorites_pkey" PRIMARY KEY ("user_id", "psychologist_id"),
  CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "favorites_psychologist_id_fkey" FOREIGN KEY ("psychologist_id") REFERENCES "app"."psychologists"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "favorites_psychologist_id_idx" ON "app"."favorites"("psychologist_id");

CREATE TABLE "app"."audit_logs" (
  "id" UUID NOT NULL, "actor_user_id" UUID, "action" VARCHAR(120) NOT NULL,
  "entity_type" VARCHAR(100) NOT NULL, "entity_id" UUID NOT NULL, "metadata" JSONB,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "audit_logs_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "app"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "audit_logs_entity_idx" ON "app"."audit_logs"("entity_type", "entity_id", "created_at");
CREATE INDEX "audit_logs_actor_idx" ON "app"."audit_logs"("actor_user_id", "created_at");

REVOKE ALL ON ALL TABLES IN SCHEMA "app" FROM "anon", "authenticated";
