import { prisma } from '@/lib/db';
import * as XLSX from 'xlsx';
import { getPropertiesOfClient } from './propertyService';

export async function start() {
  const clientId= 'clm865amy0009jepxozqh2ff9'
  const husProperties= await getPropertiesOfClient(clientId)
  console.log('husProperties: ', husProperties.length)

  if (husProperties.length > 0) {
    console.log('Ya existen propiedades en la base de datos, no se importan los datos del archivo CSV');
    
    return
  }


  // Carga el archivo .xlsx
  const workbook = XLSX.readFile('propiedades_hus.xlsx');

  // Obtiene la primera hoja del archivo
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convierte la hoja de cálculo a un objeto JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  //console.log(jsonData);

  jsonData.forEach(async (property: any) => {
    //console.log("precio alquiler: ", property.precio_aqluiler);
    
    const created = await createPropertyWithPrisma(property, clientId)
    console.log('created: ', created)
  })
  
}

async function createPropertyWithPrisma(property: Propiedad, clientId: string) {
  
  const created= await prisma.property.create({
    data: {
      idPropiedad: property.id_propiedad+"",
      tipo: property.id_propiedad_tipo+"",
      titulo: property.web_titulo ? property.web_titulo+"" : "",
      descripcion: property.descripcion ? property.descripcion+"" : "",
      zona: property.zona ? property.zona+"" : "",
      ciudad: property.ciudad ? property.ciudad+"" : "",
      departamento: property.departamento ? property.departamento+"" : "",
      pais: property.codigo_pais ? property.codigo_pais+"" : "",
      enVenta: property.en_venta == "1" ? "si" : "no",
      enAlquiler: property.en_alquiler == "1" ? "si" : "no",
      monedaVenta: property.moneda_venta ? property.moneda_venta+"" : "",
      precioVenta: property.precio_venta ? property.precio_venta+"" : "",
      monedaAlquiler: property.moneda_alquiler ? property.moneda_alquiler+"" : "",
      precioAlquiler: property.precio_aqluiler ? property.precio_aqluiler+"" : "",
      monedaAlquilerTemporal: property.moneda_alquiler ? property.moneda_alquiler+"" : "",
      precioAlquilerTemporal: property.precio_alquiler_variable ? property.precio_alquiler_variable+"" : "",
      alquilada: property.alquilada == "1" ? "si" : "no",
      dormitorios: property.dormitorios ? property.dormitorios+"" : "",
      banios: property.banios ? property.banios+"" : "",
      garages: property.garages ? property.garages+"" : "",
      parrilleros: property.parrillero ? property.parrillero+"" : "",
      piscinas: property.piscina ? property.piscina+"" : "",
      calefaccion: property.calefaccion ? property.calefaccion+"" : "",
      amueblada: property.amueblado ? property.amueblado+"" : "",
      piso: property.piso ? property.piso+"" : "",
      pisosEdificio: property.pisos_edificio ? property.pisos_edificio+"" : "",
      seguridad: property.seguridad == "1" ? "si" : "no",
      asensor: property.ascensor == "1" ? "si" : "no",
      lavadero: property.lavadero == "1" ? "si" : "no",
      superficieTotal: property.superficie ? property.superficie+"" : "",
      superficieConstruida: property.superficie_construida ? property.superficie_construida+"" : "",
      monedaGastosComunes: property.moneda_gastos_comunes ? property.moneda_gastos_comunes+"" : "",
      gastosComunes: property.gastos_comunes ? property.gastos_comunes+"" : "",
      clientId
    }
  })
  
  return created
}



async function main() {
  start()
}

main()

type Propiedad = {
  id_propiedad: string;
  padron: string;
  id_propiedad_tipo: string;
  direccion: string;
  direccion_sec: string;
  zona: string;
  ciudad: string;
  departamento: string;
  codigo_pais: string;
  fecha_ingreso: string;
  en_venta: string;
  en_alquiler: string;
  moneda_venta: string;
  moneda_alquiler: string;
  precio_venta: string;
  precio_aqluiler: string;
  precio_alquiler_variable: string;
  alquilada: string;
  vencimiento_alquiler: string;
  de_intermediario: string;
  superficie: string;
  dormitorios: string;
  banios: string;
  garages: string;
  notas: string;
  descripcion: string;
  web: string;
  web_titulo: string;
  web_descripcion: string;
  web_venta: string;
  web_alquiler: string;
  web_ocultar_precio_venta: string;
  web_ocultar_precio_alquiler: string;
  web_destacada: string;
  web_caracteristicas: string;
  superficie_unidad: string;
  superficie_construida: string;
  superficie_terreno: string;
  superficie_balcones: string;
  moneda_gastos_comunes: string;
  gastos_comunes: string;
  moneda_gastos_comunes_inquilino: string;
  gastos_comunes_inquilino: string;
  piscina: string;
  parrillero: string;
  calefaccion: string;
  amueblado: string;
  orientacion: string;
  disposicion: string;
  propiedad_horizontal: string;
  piso: string;
  pisos_edificio: string;
  seguridad: string;
  ascensor: string;
  lavadero: string;
};
