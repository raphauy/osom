"use server"

import { getPropertiesOfClient, getProperty } from "@/services/propertyService";
import { Property } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * model Property {
  id                     String    @id @default(cuid())
  idPropiedad            String?
  tipo                   String?
  titulo                 String?
  descripcion            String?
  zona                   String?
  ciudad                 String?
  departamento           String?
  pais                   String?
  enVenta                String?
  enAlquiler             String?
  enAlquilerTemporal     String?
  monedaVenta            String?
  precioVenta            String?
  monedaAlquiler         String?
  precioAlquiler         String?
  monedaAlquilerTemporal String?
  precioAlquilerTemporal String?
  alquilada              String?  
  dormitorios            String?
  banios                 String?
  garages                String?
  parrilleros            String?
  piscinas               String?
  calefaccion            String?
  amueblada              String?
  piso                   String?
  pisosEdificio          String?
  seguridad              String?
  asensor                String?
  lavadero               String?
  superficieTotal        String?
  superficieConstruida   String?
  monedaGastosComunes    String?
  gastosComunes          String?

  client                Client?   @relation(fields: [clientId], references: [id], onDelete: NoAction)
  clientId              String?
}

 */

export type DataProperty = {
    id: string
    idPropiedad: string
    tipo: string
    titulo: string
    descripcion: string
    zona: string
    ciudad: string
    departamento: string
    pais: string
    enVenta: string
    enAlquiler: string
    enAlquilerTemporal: string
    monedaVenta: string
    precioVenta: string
    monedaAlquiler: string
    precioAlquiler: string
    monedaAlquilerTemporal: string
    precioAlquilerTemporal: string
    alquilada: string
    dormitorios: string
    banios: string
    garages: string
    parrilleros: string
    piscinas: string
    calefaccion: string
    amueblada: string
    piso: string
    pisosEdificio: string
    seguridad: string
    asensor: string
    lavadero: string
    superficieTotal: string
    superficieConstruida: string
    monedaGastosComunes: string
    gastosComunes: string    
}
