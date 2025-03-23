/*
  Warnings:

  - You are about to drop the `Claim` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dependant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlanCoverage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Provider` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "gender" AS ENUM ('M', 'F', 'Other');

-- CreateEnum
CREATE TYPE "claim_status" AS ENUM ('Pending', 'Approved', 'Rejected');

-- DropForeignKey
ALTER TABLE "Claim" DROP CONSTRAINT "Claim_memberID_fkey";

-- DropForeignKey
ALTER TABLE "Claim" DROP CONSTRAINT "Claim_provider_id_fkey";

-- DropForeignKey
ALTER TABLE "Claim" DROP CONSTRAINT "Claim_serviceID_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_dependant_id_fkey";

-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_memberID_fkey";

-- DropForeignKey
ALTER TABLE "PlanCoverage" DROP CONSTRAINT "PlanCoverage_planID_fkey";

-- DropForeignKey
ALTER TABLE "PlanCoverage" DROP CONSTRAINT "PlanCoverage_serviceID_fkey";

-- DropTable
DROP TABLE "Claim";

-- DropTable
DROP TABLE "Dependant";

-- DropTable
DROP TABLE "Member";

-- DropTable
DROP TABLE "Plan";

-- DropTable
DROP TABLE "PlanCoverage";

-- DropTable
DROP TABLE "Provider";

-- DropTable
DROP TABLE "Service";

-- DropEnum
DROP TYPE "ClaimStatus";

-- DropEnum
DROP TYPE "Gender";

-- CreateTable
CREATE TABLE "dependant" (
    "dependant_id" SERIAL NOT NULL,
    "dependant_name" VARCHAR(100) NOT NULL,
    "dependant_address" VARCHAR(255),
    "dependant_contact" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dependant_pkey" PRIMARY KEY ("dependant_id")
);

-- CreateTable
CREATE TABLE "member" (
    "member_id" SERIAL NOT NULL,
    "dependant_id" INTEGER,
    "member_name" VARCHAR(100) NOT NULL,
    "member_email" VARCHAR(100) NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "gender" "gender",
    "address" VARCHAR(255),
    "phone_number" VARCHAR(15),
    "member_effective_start_date" TIMESTAMP(3),
    "member_effective_end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_pkey" PRIMARY KEY ("member_id")
);

-- CreateTable
CREATE TABLE "plan" (
    "plan_id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "plan_name" VARCHAR(100) NOT NULL,
    "plan_description" TEXT,
    "plan_start_date" TIMESTAMP(3),
    "plan_end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "service" (
    "service_id" SERIAL NOT NULL,
    "service_name" VARCHAR(100) NOT NULL,
    "service_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "plan_coverage" (
    "plan_coverage_id" SERIAL NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "allowed_amount" DECIMAL(10,2) NOT NULL,
    "copay" DECIMAL(5,2) NOT NULL,
    "coinsurance" DECIMAL(5,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_coverage_pkey" PRIMARY KEY ("plan_coverage_id")
);

-- CreateTable
CREATE TABLE "provider" (
    "provider_id" SERIAL NOT NULL,
    "provider_name" VARCHAR(100) NOT NULL,
    "provider_type" VARCHAR(50),
    "address" VARCHAR(255),
    "contact_number" VARCHAR(15),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_pkey" PRIMARY KEY ("provider_id")
);

-- CreateTable
CREATE TABLE "claim" (
    "claim_id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "claim_amount" DECIMAL(10,2) NOT NULL,
    "service_date" TIMESTAMP(3),
    "submission_date" TIMESTAMP(3),
    "approval_date" TIMESTAMP(3),
    "claim_status" "claim_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_pkey" PRIMARY KEY ("claim_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_member_email_key" ON "member"("member_email");

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_dependant_id_fkey" FOREIGN KEY ("dependant_id") REFERENCES "dependant"("dependant_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan" ADD CONSTRAINT "plan_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_coverage" ADD CONSTRAINT "plan_coverage_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plan"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_coverage" ADD CONSTRAINT "plan_coverage_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("service_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("service_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider"("provider_id") ON DELETE RESTRICT ON UPDATE CASCADE;
