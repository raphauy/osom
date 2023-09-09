-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "embedding" vector(1536);
