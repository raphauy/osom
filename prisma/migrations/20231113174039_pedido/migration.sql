-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "contacto" TEXT,
    "operacion" TEXT,
    "tipo" TEXT,
    "presupuesto" TEXT,
    "zona" TEXT,
    "dormitorios" TEXT,
    "caracteristicas" TEXT,
    "embeddings" vector(1536),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);
