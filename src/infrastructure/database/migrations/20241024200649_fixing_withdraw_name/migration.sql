/*
  Warnings:

  - The values [WITHDRAWAL] on the enum `TransactionTypeEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionTypeEnum_new" AS ENUM ('DEPOSIT', 'WITHDRAW', 'TRANSFER');
ALTER TABLE "transactions" ALTER COLUMN "Tipo" TYPE "TransactionTypeEnum_new" USING ("Tipo"::text::"TransactionTypeEnum_new");
ALTER TYPE "TransactionTypeEnum" RENAME TO "TransactionTypeEnum_old";
ALTER TYPE "TransactionTypeEnum_new" RENAME TO "TransactionTypeEnum";
DROP TYPE "TransactionTypeEnum_old";
COMMIT;
