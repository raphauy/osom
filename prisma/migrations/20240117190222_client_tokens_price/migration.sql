-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "completionTokensPrice" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "promptTokensPrice" INTEGER NOT NULL DEFAULT 0;
