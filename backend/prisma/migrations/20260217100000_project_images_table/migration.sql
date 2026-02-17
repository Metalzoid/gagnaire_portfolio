-- CreateTable
CREATE TABLE "ProjectImage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectImage_pkey" PRIMARY KEY ("id")
);

-- Migration des données JSON existantes vers ProjectImage
-- Image principale (order 0)
INSERT INTO "ProjectImage" ("id", "projectId", "path", "order", "createdAt")
SELECT
    gen_random_uuid()::text,
    "id",
    "images"->>'main',
    0,
    NOW()
FROM "Project"
WHERE "images"->>'main' IS NOT NULL AND "images"->>'main' != '';

-- Thumbnails (order 1, 2, 3...)
INSERT INTO "ProjectImage" ("id", "projectId", "path", "order", "createdAt")
SELECT
    gen_random_uuid()::text,
    p."id",
    t.elem,
    t.ord::integer,
    NOW()
FROM "Project" p,
LATERAL jsonb_array_elements_text(COALESCE(p."images"->'thumbnails', '[]'::jsonb)) WITH ORDINALITY AS t(elem, ord)
WHERE jsonb_array_length(COALESCE(p."images"->'thumbnails', '[]'::jsonb)) > 0;

-- Drop images column from Project
ALTER TABLE "Project" DROP COLUMN "images";

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
