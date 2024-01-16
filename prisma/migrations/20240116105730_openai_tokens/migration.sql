-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "completionTokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "promptTokens" INTEGER NOT NULL DEFAULT 0;
