-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F', 'Other');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateTable
CREATE TABLE "Dependant" (
    "dependant_id" SERIAL NOT NULL,
    "dependant_name" VARCHAR(100) NOT NULL,
    "dependant_address" VARCHAR(255),
    "dependant_contact" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dependant_pkey" PRIMARY KEY ("dependant_id")
);

-- CreateTable
CREATE TABLE "Member" (
    "memberID" SERIAL NOT NULL,
    "dependant_id" INTEGER,
    "member_name" VARCHAR(100) NOT NULL,
    "member_email" VARCHAR(100) NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "gender" "Gender",
    "address" VARCHAR(255),
    "phone_number" VARCHAR(15),
    "member_effective_start_date" TIMESTAMP(3),
    "member_effective_end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("memberID")
);

-- CreateTable
CREATE TABLE "Plan" (
    "planID" SERIAL NOT NULL,
    "memberID" INTEGER NOT NULL,
    "plan_name" VARCHAR(100) NOT NULL,
    "plan_description" TEXT,
    "plan_start_date" TIMESTAMP(3),
    "plan_end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("planID")
);

-- CreateTable
CREATE TABLE "Service" (
    "serviceID" SERIAL NOT NULL,
    "service_name" VARCHAR(100) NOT NULL,
    "service_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("serviceID")
);

-- CreateTable
CREATE TABLE "PlanCoverage" (
    "planCoverageID" SERIAL NOT NULL,
    "planID" INTEGER NOT NULL,
    "serviceID" INTEGER NOT NULL,
    "allowed_amount" DECIMAL(10,2) NOT NULL,
    "copay" DECIMAL(5,2) NOT NULL,
    "coinsurance" DECIMAL(5,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanCoverage_pkey" PRIMARY KEY ("planCoverageID")
);

-- CreateTable
CREATE TABLE "Provider" (
    "provider_id" SERIAL NOT NULL,
    "provider_name" VARCHAR(100) NOT NULL,
    "provider_type" VARCHAR(50),
    "address" VARCHAR(255),
    "contact_number" VARCHAR(15),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("provider_id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "claimID" SERIAL NOT NULL,
    "memberID" INTEGER NOT NULL,
    "serviceID" INTEGER NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "claim_amount" DECIMAL(10,2) NOT NULL,
    "service_date" TIMESTAMP(3),
    "submission_date" TIMESTAMP(3),
    "approval_date" TIMESTAMP(3),
    "claim_status" "ClaimStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("claimID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_member_email_key" ON "Member"("member_email");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_dependant_id_fkey" FOREIGN KEY ("dependant_id") REFERENCES "Dependant"("dependant_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_memberID_fkey" FOREIGN KEY ("memberID") REFERENCES "Member"("memberID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanCoverage" ADD CONSTRAINT "PlanCoverage_planID_fkey" FOREIGN KEY ("planID") REFERENCES "Plan"("planID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanCoverage" ADD CONSTRAINT "PlanCoverage_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("serviceID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_memberID_fkey" FOREIGN KEY ("memberID") REFERENCES "Member"("memberID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("serviceID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "Provider"("provider_id") ON DELETE RESTRICT ON UPDATE CASCADE;
