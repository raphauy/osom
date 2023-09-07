-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "idPropiedad" TEXT,
    "tipo" TEXT,
    "titulo" TEXT,
    "descripcion" TEXT,
    "zona" TEXT,
    "ciudad" TEXT,
    "departamento" TEXT,
    "pais" TEXT,
    "enVenta" TEXT,
    "enAlquiler" TEXT,
    "enAlquilerTemporal" TEXT,
    "monedaVenta" TEXT,
    "precioVenta" TEXT,
    "monedaAlquiler" TEXT,
    "precioAlquiler" TEXT,
    "monedaAlquilerTemporal" TEXT,
    "precioAlquilerTemporal" TEXT,
    "alquilada" TEXT,
    "dormitorios" TEXT,
    "banios" TEXT,
    "garages" TEXT,
    "parrilleros" TEXT,
    "piscinas" TEXT,
    "calefaccion" TEXT,
    "amueblada" TEXT,
    "piso" TEXT,
    "pisosEdificio" TEXT,
    "seguridad" TEXT,
    "asensor" TEXT,
    "lavadero" TEXT,
    "superficieTotal" TEXT,
    "superficieConstruida" TEXT,
    "monedaGastosComunes" TEXT,
    "gastosComunes" TEXT,
    "clientId" TEXT,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
