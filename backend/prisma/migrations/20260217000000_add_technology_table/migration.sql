-- CreateTable
CREATE TABLE "Technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "category" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExperienceToTechnology" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectToTechnology" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Technology_name_key" ON "Technology"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ExperienceToTechnology_AB_unique" ON "_ExperienceToTechnology"("A", "B");

-- CreateIndex
CREATE INDEX "_ExperienceToTechnology_B_index" ON "_ExperienceToTechnology"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToTechnology_AB_unique" ON "_ProjectToTechnology"("A", "B");

-- AddForeignKey
ALTER TABLE "_ExperienceToTechnology" ADD CONSTRAINT "_ExperienceToTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExperienceToTechnology" ADD CONSTRAINT "_ExperienceToTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTechnology" ADD CONSTRAINT "_ProjectToTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTechnology" ADD CONSTRAINT "_ProjectToTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing Project technologies to Technology table
INSERT INTO "Technology" ("id", "name", "icon", "category", "order", "createdAt", "updatedAt")
SELECT
    'tech_' || md5(tech_name::text) as id,
    tech_name as name,
    NULL::TEXT as icon,
    NULL::TEXT as category,
    0 as "order",
    CURRENT_TIMESTAMP as "createdAt",
    CURRENT_TIMESTAMP as "updatedAt"
FROM (
    SELECT DISTINCT unnest("technologies")::TEXT as tech_name
    FROM "Project"
    WHERE "technologies" IS NOT NULL AND array_length("technologies", 1) > 0
) AS project_techs
ON CONFLICT ("name") DO NOTHING;

-- Migrate existing Experience technologies (add any new ones)
INSERT INTO "Technology" ("id", "name", "icon", "category", "order", "createdAt", "updatedAt")
SELECT
    'tech_' || md5(tech_name::text) as id,
    tech_name as name,
    NULL::TEXT as icon,
    NULL::TEXT as category,
    0 as "order",
    CURRENT_TIMESTAMP as "createdAt",
    CURRENT_TIMESTAMP as "updatedAt"
FROM (
    SELECT DISTINCT unnest("technologies")::TEXT as tech_name
    FROM "Experience"
    WHERE "technologies" IS NOT NULL AND array_length("technologies", 1) > 0
) AS exp_techs
ON CONFLICT ("name") DO NOTHING;

-- Populate _ProjectToTechnology from Project.technologies
INSERT INTO "_ProjectToTechnology" ("A", "B")
SELECT p."id" as "A", t."id" as "B"
FROM "Project" p
CROSS JOIN LATERAL unnest(p."technologies") AS tech_name
JOIN "Technology" t ON t."name" = tech_name::TEXT
WHERE p."technologies" IS NOT NULL AND array_length(p."technologies", 1) > 0;

-- Populate _ExperienceToTechnology from Experience.technologies
INSERT INTO "_ExperienceToTechnology" ("A", "B")
SELECT e."id" as "A", t."id" as "B"
FROM "Experience" e
CROSS JOIN LATERAL unnest(e."technologies") AS tech_name
JOIN "Technology" t ON t."name" = tech_name::TEXT
WHERE e."technologies" IS NOT NULL AND array_length(e."technologies", 1) > 0;

-- DropColumn
ALTER TABLE "Project" DROP COLUMN "technologies";

-- DropColumn
ALTER TABLE "Experience" DROP COLUMN "technologies";
