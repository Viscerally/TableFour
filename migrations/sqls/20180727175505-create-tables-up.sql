CREATE TABLE "customers" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "name" CHARACTER[20] NOT NULL,
  "phone" BIGINT NOT NULL,
  "email" CHARACTER[20],
);

CREATE TABLE "reservations" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "placement_time" TIMESTAMPZ,
  "phone" BIGINT,
  "email" CHARACTER[20],
  "completedAt" TIMESTAMPTZ,
  "deletedAt" TIMESTAMPTZ
);
