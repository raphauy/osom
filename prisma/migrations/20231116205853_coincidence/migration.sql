-- CreateTable
CREATE TABLE "Coincidence" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coincidence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Coincidence" ADD CONSTRAINT "Coincidence_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coincidence" ADD CONSTRAINT "Coincidence_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
