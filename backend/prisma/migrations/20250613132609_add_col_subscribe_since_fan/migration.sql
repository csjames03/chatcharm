-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Fan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "subscribeSince" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Fan" ("avatarUrl", "id", "name") SELECT "avatarUrl", "id", "name" FROM "Fan";
DROP TABLE "Fan";
ALTER TABLE "new_Fan" RENAME TO "Fan";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
