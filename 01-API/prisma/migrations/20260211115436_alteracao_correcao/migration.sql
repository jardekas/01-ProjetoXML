/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "USER" (
    "id" SERIAL NOT NULL,
    "idContador" INTEGER,
    "id_empresa" INTEGER NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "cpf" TEXT NOT NULL,
    "senha" VARCHAR(60) NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "flg_admin" BOOLEAN,
    "flg_ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "USER_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CONTADOR" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(60) NOT NULL,
    "cnpj" VARCHAR(18) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "telefone" VARCHAR(20),
    "flgAtivo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CONTADOR_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TIPO_DOC" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(60) NOT NULL,
    "flgAtivo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TIPO_DOC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DOCUMENTO" (
    "id" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "data" DATE NOT NULL,
    "nroDoc" INTEGER NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "status" VARCHAR(30),
    "modelo" INTEGER NOT NULL,
    "caminho" TEXT NOT NULL,
    "dtCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DOCUMENTO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TOTAL_DOC" (
    "id" SERIAL NOT NULL,
    "idDoc" INTEGER NOT NULL,
    "idTipo" INTEGER NOT NULL,
    "conteudo" TEXT,
    "valor" DECIMAL(65,30),

    CONSTRAINT "TOTAL_DOC_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USER_cpf_key" ON "USER"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "CONTADOR_cnpj_key" ON "CONTADOR"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "CONTADOR_email_key" ON "CONTADOR"("email");

-- CreateIndex
CREATE INDEX "IDX_DOCUMENTO_DATA" ON "DOCUMENTO"("data");

-- CreateIndex
CREATE INDEX "IDX_TOTAL_DOC_VALOR" ON "TOTAL_DOC"("valor");

-- AddForeignKey
ALTER TABLE "USER" ADD CONSTRAINT "USER_idContador_fkey" FOREIGN KEY ("idContador") REFERENCES "CONTADOR"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DOCUMENTO" ADD CONSTRAINT "DOCUMENTO_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "USER"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TOTAL_DOC" ADD CONSTRAINT "TOTAL_DOC_idDoc_fkey" FOREIGN KEY ("idDoc") REFERENCES "DOCUMENTO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TOTAL_DOC" ADD CONSTRAINT "TOTAL_DOC_idTipo_fkey" FOREIGN KEY ("idTipo") REFERENCES "TIPO_DOC"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
