/*
  Warnings:

  - Added the required column `EMPcpfCNPJ` to the `DOCUMENTO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashDoc` to the `DOCUMENTO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EMPcpfCNPJ` to the `USER` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashCNPJ` to the `USER` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DOCUMENTO" DROP CONSTRAINT "DOCUMENTO_idUser_fkey";

-- AlterTable
ALTER TABLE "DOCUMENTO" ADD COLUMN     "EMPcpfCNPJ" VARCHAR(18) NOT NULL,
ADD COLUMN     "hashDoc" VARCHAR(64) NOT NULL,
ALTER COLUMN "idUser" DROP NOT NULL;

-- AlterTable
ALTER TABLE "USER" ADD COLUMN     "EMPcpfCNPJ" VARCHAR(18) NOT NULL,
ADD COLUMN     "hashCNPJ" VARCHAR(64) NOT NULL;

-- CreateTable
CREATE TABLE "EMPRESA" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "cpfCNPJ" VARCHAR(18) NOT NULL,
    "EMAIL" VARCHAR(100),
    "TELEFONE" VARCHAR(20),
    "flg_ativo" BOOLEAN NOT NULL DEFAULT true,
    "document" TEXT,

    CONSTRAINT "EMPRESA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EMPRESA_DOCUMENTO" (
    "id" SERIAL NOT NULL,
    "idEmpresa" INTEGER NOT NULL,
    "documento" TEXT NOT NULL,

    CONSTRAINT "EMPRESA_DOCUMENTO_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EMPRESA_cpfCNPJ_key" ON "EMPRESA"("cpfCNPJ");

-- CreateIndex
CREATE INDEX "DOCUMENTO_EMPcpfCNPJ_idx" ON "DOCUMENTO"("EMPcpfCNPJ");

-- CreateIndex
CREATE INDEX "DOCUMENTO_idUser_idx" ON "DOCUMENTO"("idUser");

-- CreateIndex
CREATE INDEX "USER_EMPcpfCNPJ_idx" ON "USER"("EMPcpfCNPJ");

-- CreateIndex
CREATE INDEX "USER_hashCNPJ_idx" ON "USER"("hashCNPJ");

-- AddForeignKey
ALTER TABLE "DOCUMENTO" ADD CONSTRAINT "DOCUMENTO_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "USER"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EMPRESA_DOCUMENTO" ADD CONSTRAINT "EMPRESA_DOCUMENTO_idEmpresa_fkey" FOREIGN KEY ("idEmpresa") REFERENCES "EMPRESA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
