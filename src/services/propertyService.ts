import { Percentages } from "@/app/admin/clients/(crud)/actions";
import { prisma } from "@/lib/db";
import { Property } from "@prisma/client";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import pgvector from 'pgvector/utils';
import { getClient } from "./clientService";

export default async function getPropertys() {

  const found = await prisma.property.findMany({
    orderBy: {
      idPropiedad: 'asc',
    },
  })

  return found;
}

export async function getPropertiesOfClient(clientId: string) {

  const found = await prisma.property.findMany({
    where: {
      clientId
    },
    orderBy: {
      idPropiedad: 'asc',
    },
  })

  return found;
}

export async function getSpecificPropertiesOfClient(clientId: string, specifics: string[]) {

  const found = await prisma.property.findMany({
    where: {
      clientId,
      idPropiedad: {
        in: specifics
      }
    },
  })

  // ordenar los resultados en el mismo orden que los ids de entrada
  const sorted: Property[] = found.sort((a, b) => {
    const aIndex = specifics.indexOf(a.idPropiedad ?? '')
    const bIndex = specifics.indexOf(b.idPropiedad ?? '')
    return aIndex - bIndex
  })


  return sorted
}

export async function getPercentages(clientId: string): Promise<Percentages> {
  
    const found = await prisma.property.findMany({
      where: {
        clientId
      },
      select: {
        enVenta: true,
        enAlquiler: true,
      },
    })
  
    const sales = found.filter((property) => property.enVenta === 'si').length
    const rents = found.filter((property) => property.enAlquiler === 'si').length
  
    return {
      sales: `${sales}`,
      rents: `${rents}`,
    }
}


export async function getProperty(id: string) {

  const found = await prisma.property.findUnique({
    where: {
      id
    },
  })

  return found
}

export async function deleteProperty(id: string): Promise<Property> {
  const deleted= await prisma.property.delete({
    where: {
      id
    },
  })

  return deleted
}

export async function deleteAllPropertiesOfClient(clientId: string): Promise<boolean> {
  const deleted= await prisma.property.deleteMany({
    where: {
      clientId
    },
  })

  if (!deleted) return false

  return true
}

export async function getPropertyFromClientByURL(url: string, clientId: string) {
  
    const found = await prisma.property.findFirst({
      where: {
        clientId,
        url,
      },
    })
  
    return found
}

export async function getPropertyFromClientById(idPropiedad: string, clientId: string) {
    
      const found = await prisma.property.findFirst({
        where: {
          clientId,
          idPropiedad,
        },
      })
    
      return found  
}

export async function getPropertiesCount(clientId: string) {

  const found = await prisma.property.count({
    where: {
      clientId
    },
  })

  return found  
}

export type PropertyDataToEmbed = {
  id?: string;
  idPropiedad?: string
  tipo?: string
  enVenta?: string
  enAlquiler?: string
  alquilada?: string
  zona?: string
  ciudad?: string
  departamento?: string
  dormitorios?: string
  banios?: string
  garages?: string
  parrilleros?: string
  piscinas?: string
  calefaccion?: string
  monedaVenta?: string
  precioVenta?: string
  monedaAlquiler?: string
  precioAlquiler?: string
  monedaGastosComunes?: string
  gastosComunes?: string
  titulo?: string
  descripcion?: string
}


export async function updateEmbeddings() {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    verbose: true,
  })

  // iterar sobre las primeras 5 propiedades
  const properties: PropertyDataToEmbed[] = await prisma.$queryRaw`SELECT 
  id,
  "idPropiedad",
  tipo, 
  "enVenta", 
  "enAlquiler", 
  alquilada, 
  zona, 
  ciudad,  
  departamento,
  dormitorios,
  banios,
  garages,
  parrilleros,
  piscinas,
  calefaccion,
  "monedaVenta",
  "precioVenta",
  "monedaAlquiler",
  "precioAlquiler",
  "monedaGastosComunes",
  "gastosComunes",
  titulo,
  descripcion
  FROM "Property"`;
  //FROM "Property" LIMIT 1`;

  for (const property of properties) {
    let textToEmbed= property.tipo
    if (property.enVenta === 'si' && property.enAlquiler === 'si')
      textToEmbed += ' en venta y alquiler'
    else if (property.enVenta === 'si')
      textToEmbed += ' en venta'
    else if (property.enAlquiler === 'si')
      textToEmbed += ' en alquiler'
    property.zona !== "" && (textToEmbed += ` en ${property.zona},`)
    property.ciudad !== "" && (textToEmbed += ` en ${property.ciudad},`)
    property.departamento !== "" && (textToEmbed += ` en ${property.departamento},`)    
    property.dormitorios !== "" && (textToEmbed += ` con ${property.dormitorios} dormitorios,`)
    property.banios !== "" && (textToEmbed += ` con ${property.banios} baños,`)
    property.garages !== "" && (textToEmbed += ` con ${property.garages} garages,`)
    property.parrilleros !== "" && (textToEmbed += ` con ${property.parrilleros} parrilleros,`)
    property.piscinas !== "" && (textToEmbed += ` con ${property.piscinas} piscinas,`)
    property.calefaccion !== "" && (textToEmbed += ` con calefacción,`)
    property.monedaVenta !== "" && property.precioVenta !== "" && (textToEmbed += ` con precio de venta ${property.precioVenta} ${property.monedaVenta},`)
    property.monedaAlquiler !== "" && property.precioAlquiler !== "" && (textToEmbed += ` con precio de alquiler ${property.precioAlquiler} ${property.monedaAlquiler},`)
    property.monedaGastosComunes !== "" && property.gastosComunes !== "" && (textToEmbed += ` con gastos comunes de ${property.gastosComunes} ${property.monedaGastosComunes}.`)
    property.titulo !== "" && (textToEmbed += `. ${property.titulo}.`)
    property.descripcion !== "" && (textToEmbed += `. ${property.descripcion}.`)

    if (!textToEmbed) {
      console.log(`No text to embed for property ${property.idPropiedad}`)
      continue
    }
    const id= property.id
    // remove field id from content object
    delete property.id
    // remove all fields that are empty strings
    const keys= Object.keys(property)
    for (const key of keys) {
      if (property[key as keyof PropertyDataToEmbed] === '') {
        delete property[key as keyof PropertyDataToEmbed]
      }
    }


    const vector= await embeddings.embedQuery(textToEmbed)
    const embedding = pgvector.toSql(vector)
    await prisma.$executeRaw`UPDATE "Property" SET embedding = ${embedding}::vector, content = ${textToEmbed} WHERE id = ${id}`
    console.log(`Text embeded: ${textToEmbed}`)    
  }  

}

export async function updateEmbedding(propertyId: string) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    verbose: true,
  })

  // iterar sobre las primeras 5 propiedades
  const properties: PropertyDataToEmbed[] = await prisma.$queryRaw`SELECT 
  id,
  "idPropiedad",
  tipo, 
  "enVenta", 
  "enAlquiler", 
  alquilada, 
  zona, 
  ciudad,  
  departamento,
  dormitorios,
  banios,
  garages,
  parrilleros,
  piscinas,
  calefaccion,
  "monedaVenta",
  "precioVenta",
  "monedaAlquiler",
  "precioAlquiler",
  "monedaGastosComunes",
  "gastosComunes",
  titulo,
  descripcion
  FROM "Property"
  WHERE id=${propertyId}`;

  for (const property of properties) {
    let textToEmbed= property.tipo
    if (property.enVenta === 'si' && property.enAlquiler === 'si')
      textToEmbed += ' en venta y alquiler'
    else if (property.enVenta === 'si')
      textToEmbed += ' en venta'
    else if (property.enAlquiler === 'si')
      textToEmbed += ' en alquiler'
    property.zona !== null && property.zona !== "" && (textToEmbed += ` en ${property.zona},`)
    property.ciudad !== null && property.ciudad !== "" && (textToEmbed += ` en ${property.ciudad},`)
    property.departamento !== null && property.departamento !== "" && (textToEmbed += ` en ${property.departamento},`)    
    property.dormitorios !== null && property.dormitorios !== "" && (textToEmbed += ` con ${property.dormitorios} dormitorios,`)
    property.banios !== null && property.banios !== "" && (textToEmbed += ` con ${property.banios} baños,`)
    property.garages !== null && property.garages !== "" && (textToEmbed += ` con ${property.garages} garages,`)
    property.parrilleros !== null && property.parrilleros !== "" && (textToEmbed += ` con ${property.parrilleros} parrilleros,`)
    property.piscinas !== null && property.piscinas !== "" && (textToEmbed += ` con ${property.piscinas} piscinas,`)
    property.calefaccion !== null && property.calefaccion !== "" && (textToEmbed += ` con calefacción,`)
    property.monedaVenta !== null && property.monedaVenta !== "" && property.precioVenta !== "" && (textToEmbed += ` con precio de venta ${property.precioVenta} ${property.monedaVenta},`)
    property.monedaAlquiler !== null && property.monedaAlquiler !== "" && property.precioAlquiler !== "" && (textToEmbed += ` con precio de alquiler ${property.precioAlquiler} ${property.monedaAlquiler},`)
    property.monedaGastosComunes !== null && property.monedaGastosComunes !== "" && property.gastosComunes !== "" && (textToEmbed += ` con gastos comunes de ${property.gastosComunes} ${property.monedaGastosComunes}.`)
    property.titulo !== null && property.titulo !== "" && (textToEmbed += `. ${property.titulo}.`)
    property.descripcion !== null && property.descripcion !== "" && (textToEmbed += `. ${property.descripcion}.`)

    if (!textToEmbed) {
      console.log(`No text to embed for property ${property.idPropiedad}`)
      continue
    }
    const id= property.id
    // remove field id from content object
    delete property.id
    // remove all fields that are empty strings
    const keys= Object.keys(property)
    for (const key of keys) {
      if (property[key as keyof PropertyDataToEmbed] === '') {
        delete property[key as keyof PropertyDataToEmbed]
      }
    }


    const vector= await embeddings.embedQuery(textToEmbed)
    const embedding = pgvector.toSql(vector)
    await prisma.$executeRaw`UPDATE "Property" SET embedding = ${embedding}::vector, content = ${textToEmbed} WHERE id = ${id}`
    console.log(`Text embeded: ${textToEmbed}`)    
  }  

}

export type SimilaritySearchResult = {
  idPropiedad: string
  url: string
  titulo: string
  content: string
  distance: number
}
export async function similaritySearch(clientId: string, tipo: string, operacion: string, searchInput: string, limit: number = 10) : Promise<SimilaritySearchResult[]> {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    verbose: true,
  })

  const tipoConMayuscula= tipo.charAt(0).toUpperCase() + tipo.slice(1)

  const vector= await embeddings.embedQuery(searchInput)
  const embedding = pgvector.toSql(vector)

  let result: SimilaritySearchResult[]= []
  if (operacion === "venta" || operacion === "vender" || operacion === "compra" || operacion === "comprar")
    result = await prisma.$queryRaw`SELECT "idPropiedad", "url", titulo, content, embedding <-> ${embedding}::vector as distance FROM "Property" WHERE "clientId" = ${clientId} AND "tipo" = ${tipoConMayuscula} AND "enVenta" = 'si' ORDER BY distance LIMIT ${limit}`
  else if (operacion === "alquiler" || operacion === "alquilar" || operacion === "renta" || operacion === "rentar")
    result = await prisma.$queryRaw`SELECT "idPropiedad", "url", titulo, content, embedding <-> ${embedding}::vector as distance FROM "Property" WHERE "clientId" = ${clientId} AND "tipo" = ${tipoConMayuscula} AND "enAlquiler" = 'si' ORDER BY distance LIMIT ${limit}`

  result.map((item) => {
    console.log(`${item.titulo}: ${item.distance}`)    
  })

  return result
}

type ContextItem = {
  idPropiedad: string
  infoPropiedad: string
}

export async function promptChatGPT(clientId: string, tipo: string, operacion: string, llmModel: string, promptTemplate: string, userInput: string, limit: number) {
  const similarityArray= await similaritySearch(clientId, tipo, operacion, userInput, limit)
  const context: ContextItem[]= similarityArray.map((item) => {
    return {
      idPropiedad: item.idPropiedad,
      infoPropiedad: item.content,
    }
  })

  const contextString= JSON.stringify(context)

  const prompt= PromptTemplate.fromTemplate(promptTemplate)

  const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    modelName: llmModel,
  })
  console.log(`llmModel: ${llmModel}`)
  console.log("input: ", userInput)        

  const chain= new LLMChain( { llm, prompt } )

  const result= await chain.call({
    CONTEXTO: contextString,
    INPUT_CLIENTE: userInput,
  })
  console.log(`result: ${result.text}`)

  if (result.text.includes('SIN_RESULTADOS')) {
    const similarityZero= { idPropiedad: 'SIN_RESULTADOS', url: "", titulo: 'SIN_RESULTADOS', content: 'SIN_RESULTADOS', distance: 0 }

    // insert the similarityZero at the beginning of the array
    similarityArray.unshift(similarityZero)
    return similarityArray
  }

  // filtrar las propiedades que no se mostraron y mantener el orden
  const filteredSimilarityArray: SimilaritySearchResult[]= []
  for (const item of similarityArray) {
    if (result.text.includes(item.idPropiedad)) {
      filteredSimilarityArray.push(item)
    }
  }
  
  return filteredSimilarityArray  
}


export async function similaritySearchV2(clientId: string, tipo: string, operacion: string, presupuesto: number, caracteristicas: string, limit: number = 5) : Promise<SimilaritySearchResult[]> {
  const client= await getClient(clientId)
  if (!client) {
    return []
  }
  const percMin= client.budgetPercMin ? client.budgetPercMin / 100 : 1
  const percMax= client.budgetPercMax ? client.budgetPercMax / 100 : 1

  console.log("*****************************************************")
  console.log("percMin: ", percMin)
  console.log("percMax: ", percMax)  

  let upperLimit= presupuesto * (1+percMax)
  let lowerLimit= presupuesto * (1-percMin)

  const checkPresupuesto= presupuesto && percMax < 2 && percMin > 0
  console.log("checkPresupuesto: ", checkPresupuesto)

  upperLimit= Math.round(upperLimit * 100) / 100
  lowerLimit= Math.round(lowerLimit * 100) / 100

  console.log("upperLimit: ", upperLimit)
  console.log("lowerLimit: ", lowerLimit)
  console.log("*****************************************************")

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    verbose: true,
  })
  let result: SimilaritySearchResult[]= []

  const esCasa= tipo && tipo.toLowerCase().includes("casa")
  const esApartamento= tipo && (tipo.toLowerCase().includes("apartamento") || tipo.toLowerCase().includes("apto") || tipo.toLowerCase().includes("departamento") || tipo.toLowerCase().includes("depto"))
  const esVenta= operacion.toLocaleLowerCase() === "venta" || operacion.toLocaleLowerCase() === "vender" || operacion.toLocaleLowerCase() === "compra" || operacion.toLocaleLowerCase() === "comprar"
  const esAlquiler= operacion.toLocaleLowerCase() === "alquiler" || operacion.toLocaleLowerCase() === "alquilar" || operacion.toLocaleLowerCase() === "renta" || operacion.toLocaleLowerCase() === "rentar"

  const vector= await embeddings.embedQuery(caracteristicas)
  const embedding = pgvector.toSql(vector)

  if (checkPresupuesto) {
    if (esCasa && esVenta) {
      console.log("esCasa && esVenta && checkPresupuesto")
      
      result = await prisma.$queryRaw`
        SELECT "idPropiedad", "url", titulo, content, tipo, "enAlquiler", "enVenta", dormitorios, zona, "precioVenta", "precioAlquiler", "monedaVenta", "monedaAlquiler", "clientId", embedding <-> ${embedding}::vector as distance 
        FROM "Property" 
        WHERE "clientId" = ${clientId} AND LOWER("tipo") = 'casa' AND LOWER("enVenta") = 'si' AND "precioVenta"::NUMERIC >= ${lowerLimit} AND "precioVenta"::NUMERIC <= ${upperLimit}
        ORDER BY distance 
        LIMIT ${limit}`
    } else if (esCasa && esAlquiler) {
      console.log("esCasa && esAlquiler && checkPresupuesto")
      result = await prisma.$queryRaw`
        SELECT "idPropiedad", "url", titulo, content, tipo, "enAlquiler", "enVenta", dormitorios, zona, "precioVenta", "precioAlquiler", "monedaVenta", "monedaAlquiler", "clientId", embedding <-> ${embedding}::vector as distance 
        FROM "Property" 
        WHERE "clientId" = ${clientId} AND LOWER("tipo") = 'casa' AND LOWER("enAlquiler") = 'si' AND "precioAlquiler"::NUMERIC >= ${lowerLimit} AND "precioAlquiler"::NUMERIC <= ${upperLimit}
        ORDER BY distance 
        LIMIT ${limit}`
    } else if (esApartamento && esVenta) {
      console.log("esApartamento && esVenta && checkPresupuesto")
      result = await prisma.$queryRaw`
        SELECT "idPropiedad", "url", titulo, content, tipo, "enAlquiler", "enVenta", dormitorios, zona, "precioVenta", "precioAlquiler", "monedaVenta", "monedaAlquiler", "clientId", embedding <-> ${embedding}::vector as distance 
        FROM "Property" 
        WHERE "clientId" = ${clientId} AND (LOWER("tipo") = 'apartamento' OR LOWER("tipo") = 'departamento') AND LOWER("enVenta") = 'si' AND "precioVenta"::NUMERIC >= ${lowerLimit} AND "precioVenta"::NUMERIC <= ${upperLimit}
        ORDER BY distance 
        LIMIT ${limit}`
    } else if (esApartamento && esAlquiler) {
      console.log("esApartamento && esAlquiler && checkPresupuesto")
      result = await prisma.$queryRaw`
        SELECT "idPropiedad", "url", titulo, content, tipo, "enAlquiler", "enVenta", dormitorios, zona, "precioVenta", "precioAlquiler", "monedaVenta", "monedaAlquiler", "clientId", embedding <-> ${embedding}::vector as distance 
        FROM "Property" 
        WHERE "clientId" = ${clientId} AND (LOWER("tipo") = 'apartamento' OR LOWER("tipo") = 'departamento') AND LOWER("enAlquiler") = 'si' AND "precioAlquiler"::NUMERIC >= ${lowerLimit} AND "precioAlquiler"::NUMERIC <= ${upperLimit}
        ORDER BY distance 
        LIMIT ${limit}`
    } else if (esVenta) {
      console.log("esVenta && checkPresupuesto")
      result = await prisma.$queryRaw`
        SELECT "idPropiedad", "url", titulo, content, tipo, "enAlquiler", "enVenta", dormitorios, zona, "precioVenta", "monedaVenta", "monedaAlquiler", "clientId", embedding <-> ${embedding}::vector as distance 
        FROM "Property" 
        WHERE "clientId" = ${clientId} AND LOWER("enVenta") = 'si' AND "precioVenta"::NUMERIC >= ${lowerLimit} AND "precioVenta"::NUMERIC <= ${upperLimit}
        ORDER BY distance 
        LIMIT ${limit}`
    } else if (esAlquiler) {
      console.log("esAlquiler && checkPresupuesto")
      result = await prisma.$queryRaw`
        SELECT "idPropiedad", "url", titulo, content, tipo, "enVenta", "enAlquiler", dormitorios, zona, "precioAlquiler", "monedaVenta", "monedaAlquiler", "clientId", embedding <-> ${embedding}::vector as distance 
        FROM "Property" 
        WHERE "clientId" = ${clientId} AND LOWER("enAlquiler") = 'si' AND "precioAlquiler"::NUMERIC >= ${lowerLimit} AND "precioAlquiler"::NUMERIC <= ${upperLimit}
        ORDER BY distance 
        LIMIT ${limit}`
    } else {
      console.log("checkPresupuesto (sin venta ni alquiler)")
      result = await prisma.$queryRaw`
        SELECT "idPropiedad", "url", titulo, content, tipo, "enVenta", "enAlquiler", dormitorios, zona, "precioVenta", "precioAlquiler", "monedaVenta", "monedaAlquiler", "clientId", embedding <-> ${embedding}::vector as distance 
        FROM "Property"
        WHERE "clientId" = ${clientId} AND "precioVenta"::NUMERIC >= ${lowerLimit} AND "precioVenta"::NUMERIC <= ${upperLimit}
        ORDER BY distance 
        LIMIT ${limit}`
    }

  } else {
    if (esCasa && esVenta) {
      result = await prisma.$queryRaw`
        SELECT "idPropiedad", "url", titulo, content, tipo, "enAlquiler", "enVenta", dormitorios, zona, "precioVenta", "precioAlquiler", "monedaVenta", "monedaAlquiler", "clientId", embedding <-> ${embedding}::vector as distance 
        FROM "Property" 
        WHERE "clientId" = ${clientId} AND LOWER("tipo") = 'casa' AND LOWER("enVenta") = 'si'
        ORDER BY distance 
        LIMIT ${limit}`
    } else if (esCasa && esAlquiler) {
      result = await prisma.$queryRaw`
        SELECT "idPropiedad", "url", titulo, content, tipo, "enAlquiler", "enVenta", dormitorios, zona, "precioVenta", "precioAlquiler", "monedaVenta", "monedaAlquiler", "clientId", embedding <-> ${embedding}::vector as distance 
        FROM "Property" 
        WHERE "clientId" = ${clientId} AND LOWER("tipo") = 'casa' AND LOWER("enAlquiler") = 'si' 
        ORDER BY distance 
        LIMIT ${limit}`
    } else if (esApartamento && esVenta) {
      result = await prisma.$queryRaw`
        SELECT "idPropiedad", "url", titulo, content, tipo, "enAlquiler", "enVenta", dormitorios, zona, "precioVenta", "precioAlquiler", "monedaVenta", "monedaAlquiler", "clientId", embedding <-> ${embedding}::vector as distance 
        FROM "Property" 
        WHERE "clientId" = ${clientId} AND (LOWER("tipo") = 'apartamento' OR LOWER("tipo") = 'departamento') AND LOWER("enVenta") = 'si' 
        ORDER BY distance 
        LIMIT ${limit}`
    } else if (esApartamento && esAlquiler) {
      result = await prisma.$queryRaw`
        SELECT "idPropiedad", "url", titulo, content, tipo, "enAlquiler", "enVenta", dormitorios, zona, "precioVenta", "precioAlquiler", "monedaVenta", "monedaAlquiler", "clientId", embedding <-> ${embedding}::vector as distance 
        FROM "Property" 
        WHERE "clientId" = ${clientId} AND (LOWER("tipo") = 'apartamento' OR LOWER("tipo") = 'departamento') AND LOWER("enAlquiler") = 'si' 
        ORDER BY distance 
        LIMIT ${limit}`
    } else if (esVenta) {
      result = await prisma.$queryRaw`
        SELECT "idPropiedad", "url", titulo, content, tipo, "enAlquiler", "enVenta", dormitorios, zona, "precioVenta", "precioAlquiler", "monedaVenta", "monedaAlquiler", "clientId", embedding <-> ${embedding}::vector as distance 
        FROM "Property" 
        WHERE "clientId" = ${clientId} AND LOWER("enVenta") = 'si' 
        ORDER BY distance 
        LIMIT ${limit}`
    } else if (esAlquiler) {
      result = await prisma.$queryRaw`
        SELECT "idPropiedad", "url", titulo, content, tipo, "enAlquiler", "enVenta", dormitorios, zona, "precioVenta", "precioAlquiler", "monedaVenta", "monedaAlquiler", "clientId", embedding <-> ${embedding}::vector as distance 
        FROM "Property" 
        WHERE "clientId" = ${clientId} AND LOWER("enAlquiler") = 'si' 
        ORDER BY distance 
        LIMIT ${limit}`
    } else {
      result = await prisma.$queryRaw`
        SELECT "idPropiedad", "url", titulo, content, tipo, "enAlquiler", "enVenta", dormitorios, zona, "precioVenta", "precioAlquiler", "monedaVenta", "monedaAlquiler", "clientId", embedding <-> ${embedding}::vector as distance 
        FROM "Property" 
        WHERE "clientId" = ${clientId}
        ORDER BY distance 
        LIMIT ${limit}`
    }  
  }

  result.map((item) => {
    console.log(`${item.titulo}: ${item.distance}`)    
  })

  return result
}