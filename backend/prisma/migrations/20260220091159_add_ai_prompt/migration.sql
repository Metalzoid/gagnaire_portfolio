-- AlterTable
ALTER TABLE "_ExperienceToTechnology" ADD CONSTRAINT "_ExperienceToTechnology_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ExperienceToTechnology_AB_unique";

-- AlterTable
ALTER TABLE "_ProjectToTechnology" ADD CONSTRAINT "_ProjectToTechnology_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ProjectToTechnology_AB_unique";

-- CreateTable
CREATE TABLE "AiPrompt" (
    "id" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "model" TEXT NOT NULL DEFAULT 'gpt-4o',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiPrompt_target_key" ON "AiPrompt"("target");

-- CreateIndex
CREATE INDEX "_ProjectToTechnology_B_index" ON "_ProjectToTechnology"("B");
