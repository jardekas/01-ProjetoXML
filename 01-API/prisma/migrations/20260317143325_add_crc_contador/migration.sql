/*
  Warnings:

  - You are about to drop the column `email` on the `CONTADOR` table. All the data in the column will be lost.
  - You are about to drop the column `flgAtivo` on the `CONTADOR` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `CONTADOR` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `CONTADOR` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `USER` table. All the data in the column will be lost.
  - Added the required column `CRC` to the `CONTADOR` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `CONTADOR` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CNPJCli` to the `DOCUMENTO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chave44` to the `DOCUMENTO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeCli` to the `DOCUMENTO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoDoc` to the `DOCUMENTO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashSen` to the `USER` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CONTADOR_email_key";

-- AlterTable
ALTER TABLE "CONTADOR" DROP COLUMN "email",
DROP COLUMN "flgAtivo",
DROP COLUMN "nome",
DROP COLUMN "telefone",
ADD COLUMN     "CRC" VARCHAR(20) NOT NULL,
ADD COLUMN     "name" VARCHAR(60) NOT NULL;

-- AlterTable
ALTER TABLE "DOCUMENTO" ADD COLUMN     "CNPJCli" VARCHAR(18) NOT NULL,
ADD COLUMN     "baixado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "chave44" VARCHAR(64) NOT NULL,
ADD COLUMN     "nomeCli" VARCHAR(100) NOT NULL,
ADD COLUMN     "tipoDoc" VARCHAR(30) NOT NULL;

-- AlterTable
ALTER TABLE "USER" DROP COLUMN "senha",
ADD COLUMN     "flg_conta" BOOLEAN DEFAULT false,
ADD COLUMN     "hashSen" VARCHAR(64) NOT NULL,
ADD COLUMN     "telefone" VARCHAR(20),
ALTER COLUMN "flg_admin" SET DEFAULT false;

-- CreateIndex
CREATE INDEX "DOCUMENTO_hashDoc_idx" ON "DOCUMENTO"("hashDoc");

-- CreateIndex
CREATE INDEX "USER_hashSen_idx" ON "USER"("hashSen");
