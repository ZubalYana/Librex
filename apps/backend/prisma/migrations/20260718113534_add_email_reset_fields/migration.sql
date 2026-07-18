-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailChangeExpiry" TIMESTAMP(3),
ADD COLUMN     "emailChangeTokenHash" TEXT,
ADD COLUMN     "pendingEmail" TEXT;
