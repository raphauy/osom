import * as z from "zod"
import { prisma } from "@/lib/db"
import OpenAI from "openai"
import { ThreadMessage } from "openai/resources/beta/threads/messages/messages.mjs"
import { CoincidenceDAO, CoincidenceFormValues, getCoincidencesDAO } from "./coincidence-services"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import pgvector from 'pgvector/utils';
import { Pedido } from "@prisma/client"

export type PedidoDAO = {
  id:  string
  number:  number
	text:  string
	contacto?:  string
	operacion?:  string
	tipo?:  string
	presupuesto?:  string
	zona?:  string
	dormitorios?:  string
	caracteristicas?:  string
  openaiJson?:  string
	createdAt:  Date
	updatedAt:  Date
}

export const pedidoFormSchema = z.object({
	text: z.string({required_error: "Text is required."}),
	contacto: z.string().optional(),
	operacion: z.string().optional(),
	tipo: z.string().optional(),
	presupuesto: z.string().optional(),
	zona: z.string().optional(),
	dormitorios: z.string().optional(),
	caracteristicas: z.string().optional(),  
})
export type PedidoFormValues = z.infer<typeof pedidoFormSchema>

export async function getPedidosDAO() {
  const found = await prisma.pedido.findMany({
    orderBy: {
      createdAt: "desc"
    },
  })
  return found as PedidoDAO[]
}
  
export async function getPedidoDAO(id: string) {  
  const found = await prisma.pedido.findUnique({
    where: {
      id
    },
  })
  return found as PedidoDAO
}

export async function getLastPedidoDAO() {
  const found = await prisma.pedido.findFirst({
    orderBy: {
      createdAt: "desc"
    },
  })
  return found as PedidoDAO
}
    
export async function createPedido(data: PedidoFormValues) {
  const created = await prisma.pedido.create({
    data
  })

  await runThread(created.id)

  return created
}

export async function updatePedido(id: string, data: PedidoFormValues) {
  const updated = await prisma.pedido.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deletePedido(id: string) {
  const deleted = await prisma.pedido.delete({
    where: {
      id
    },
  })
  return deleted
}
    
/**
 * OpenAI functions
 */
export async function runThread(pedidoId: string) {
  console.log("running thread for pedido:", pedidoId)
  
  const OPENAI_ASSISTANT_ID= process.env.OPENAI_ASSISTANT_ID
  if (!OPENAI_ASSISTANT_ID) {
    throw new Error("OPENAI_ASSISTANT_ID is not defined")
  }

  const pedidoDAO= await getPedidoDAO(pedidoId)
  const openai = new OpenAI();

  console.log("creating thread")  
  const createdThread = await openai.beta.threads.create({
    messages: [
      {
        "role": "user",
        "content": pedidoDAO.text,
      }
    ]
  })

  console.log("creating run")
  let run = await openai.beta.threads.runs.create(
    createdThread.id, 
    { 
      assistant_id: OPENAI_ASSISTANT_ID,
      model: "gpt-3.5-turbo-1106",
    }
  )

  const runId= run.id
  let status= run.status
  console.log("run.status", status)    
  while (true) {
    run = await openai.beta.threads.runs.retrieve(
      createdThread.id,
      runId
    )
    status= run.status
    console.log("run.status", status)    
    if (status === "completed" || status === "failed" || status === "cancelled" || status === "expired") {
      break
    }
    const timeToSleep= 1
    console.log("sleeping...")
    await new Promise(resolve => setTimeout(resolve, timeToSleep * 1000))
  }

  if (status === "failed" || status === "cancelled" || status === "expired") {
    throw new Error("run is not 'completed'")
  }

  const threadMessages = await openai.beta.threads.messages.list(run.thread_id)
  
  const updates = threadMessages.data.map(async (message: ThreadMessage) => {
    if (message.role === "assistant" && message.content[0].type === "text") {
      const openaiJson = message.content[0].text.value
      let jsonObject
      
      try {
        jsonObject = JSON.parse(openaiJson)
      } catch (error) {
        console.error("Error parsing json:", error)
        return null
      }
      
      const operacion = jsonObject.operacion ? jsonObject.operacion.toUpperCase() : undefined
      
      try {
        const updated = await prisma.pedido.update({
          where: {
            id: pedidoId
          },
          data: {          
            openaiJson,
            contacto: jsonObject.contacto || undefined,
            operacion: operacion,
            tipo: jsonObject.tipo || undefined,
            presupuesto: jsonObject.presupuesto || undefined,
            zona: jsonObject.zona || undefined,
            dormitorios: jsonObject.dormitorios || undefined,
            caracteristicas: jsonObject.caracteristicas || undefined,          
          }
        })
        
        console.log("updated:")
        console.log(updated)
        return updated
      } catch (error) {
        console.error("Error updating:", error)
        return null
      }
    }
  })
  
  const results = await Promise.all(updates)
  
  const successfulUpdates = results.filter(result => result !== null)
  
  console.log("All updates completed:", successfulUpdates)
  return successfulUpdates.length > 0
}
   
  
export async function createCoincidencesProperties(pedidoId: string) {
  const pedido= await getPedidoDAO(pedidoId)
  console.log("pedido (createCoincidencesProperties):")  
  console.log(pedido)
  

  const caracteristicas= pedido.caracteristicas
  const operacion= pedido.operacion
  const tipo= pedido.tipo
  if (!tipo || tipo === "N/D") {
    console.log("El pedido no tiene tipo");    
    return []
  }
  if (!operacion || operacion === "N/D") {
    console.log("El pedido no tiene operacion");    
    return []
  }
  if (!caracteristicas || caracteristicas === "N/D") {
    console.log("El pedido no tiene caracteristicas");    
    return []
  }
  const similarityResult= await similaritySearch(tipo, operacion, caracteristicas)
  console.log("similarityResult length:", similarityResult.length);
  
  // iterate over similarityResult and create coincidences
  const coincidences: CoincidenceFormValues[]= []
  similarityResult.forEach((item) => {
    const coincidence: CoincidenceFormValues= {
      number: 1,
      // round distance to 2 decimals
      distance: Math.round(item.distance * 100) / 100,
      pedidoId: pedido.id,
      propertyId: item.id,
    }
    coincidences.push(coincidence)
  })
  const createdCoincidences = await prisma.coincidence.createMany({
    data: coincidences
  })

  await updateCoincidencesNumbers(pedidoId)

  return createdCoincidences  
}

// función que actualiza los números de coincidencias de un pedido agrupados por cliente y ordenado por distancia
// cada cliente tiene un número de coincidencias por pedido que comienza en el 1 y termina en el número de coincidencias para ese cliente
// por ejemplo, si un cliente tiene 3 coincidencias, el número de coincidencias para la primer propiedad es 1, para la segunda es 2 y para la tercera es 3
// si un cliente tiene 5 coincidencias, el número de coincidencias para la primer propiedad es 1, para la segunda es 2, para la tercera es 3, para la cuarta es 4 y para la quinta es 5
export async function updateCoincidencesNumbers(pedidoId: string) {
  const coincidences = await getCoincidencesDAO(pedidoId);
  console.log("cant coincidences:", coincidences.length);
  
  const coincidencesByClient: {[key: string]: CoincidenceDAO[]} = {};
  coincidences.forEach((coincidence) => {
    const clientId = coincidence.property.clientId;
    if (!coincidencesByClient[clientId]) {
      coincidencesByClient[clientId] = [];
    }
    coincidencesByClient[clientId].push(coincidence);
  });
  console.log("coincidencesByClient:", coincidencesByClient);
  
  for (const clientId of Object.keys(coincidencesByClient)) {
    const coincidencesForClient = coincidencesByClient[clientId];
    coincidencesForClient.sort((a, b) => a.distance - b.distance);
    
    for (let index = 0; index < coincidencesForClient.length; index++) {
      const coincidence = coincidencesForClient[index];
      const number = index + 1;
      console.log("updating coincidence:", coincidence.id, "with number:", number);
      
      try {
        await prisma.coincidence.update({
          where: {
            id: coincidence.id
          },
          data: {
            number
          }
        });
      } catch (error) {
        console.error("Error updating coincidence:", coincidence.id, error);
        // Aquí puedes decidir si lanzar el error o manejarlo de otra manera.
      }
    }
  }
}


export async function similaritySearch(tipo: string, operacion: string, caracteristicas: string, limit: number = 10) : Promise<SimilaritySearchResult[]> {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    verbose: true,
  })

  const tipoConMayuscula= tipo.charAt(0).toUpperCase() + tipo.slice(1)

  const vector= await embeddings.embedQuery(caracteristicas)
  const embedding = pgvector.toSql(vector)

  let result: SimilaritySearchResult[]= []
  if (operacion === "VENTA" || operacion === "VENDER" || operacion === "COMPRA" || operacion === "COMPRAR") {
    result = await prisma.$queryRaw`
      SELECT id, titulo, tipo, "enAlquiler", "enVenta", dormitorios, zona, "precioVenta", "precioAlquiler", "monedaVenta", "monedaAlquiler", "url", "clientId", embedding <-> ${embedding}::vector as distance 
      FROM "Property" 
      WHERE "tipo" = ${tipoConMayuscula} AND "enVenta" = 'si' 
      ORDER BY distance 
      LIMIT ${limit}`
  }
  else if (operacion === "ALQUILER" || operacion === "ALQUILAR" || operacion === "RENTA" || operacion === "RENTAR") {
    result = await prisma.$queryRaw`
      SELECT id, titulo, tipo, "enAlquiler", "enVenta", dormitorios, zona, "precioVenta", "precioAlquiler", "monedaVenta", "monedaAlquiler", "url", "clientId", embedding <-> ${embedding}::vector as distance 
      FROM "Property" 
      WHERE "tipo" = ${tipoConMayuscula} AND "enAlquiler" = 'si' 
      ORDER BY distance 
      LIMIT ${limit}`
  }

  

  result.map((item) => {
    console.log(`${item.titulo}: ${item.distance}`)    
  })

  return result
}

export type SimilaritySearchResult = {
  id: string
  titulo: string
  tipo: string
  enAlquiler: string
  enVenta: string
  monedaVenta: string
  monedaAlquiler: string
  dormitorios: string
  zona: string
  precioVenta: string
  precioAlquiler: string
  url: string
  clientId: string
  distance: number
}
