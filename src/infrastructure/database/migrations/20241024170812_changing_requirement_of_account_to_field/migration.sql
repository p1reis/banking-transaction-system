-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_Destino_fkey";

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "Destino" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_Destino_fkey" FOREIGN KEY ("Destino") REFERENCES "accounts"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;
