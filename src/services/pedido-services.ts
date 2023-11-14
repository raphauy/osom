import * as z from "zod"
import { prisma } from "@/lib/db"
import OpenAI from "openai"
import { ThreadMessage } from "openai/resources/beta/threads/messages/messages.mjs"

export type PedidoDAO = {
  id:  string
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
    
export async function createPedido(data: PedidoFormValues) {
  const created = await prisma.pedido.create({
    data
  })
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
  const OPENAI_ASSISTANT_ID= process.env.OPENAI_ASSISTANT_ID
  if (!OPENAI_ASSISTANT_ID) {
    throw new Error("OPENAI_ASSISTANT_ID is not defined")
  }

  const pedido= await getPedidoDAO(pedidoId)
  const openai = new OpenAI();

  console.log("creating thread")  
  const createdThread = await openai.beta.threads.create({
    messages: [
      {
        "role": "user",
        "content": pedido.text,
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
  
  threadMessages.data.forEach(async (message: ThreadMessage) => {
    if (message.role === "assistant" && message.content[0].type === "text") {
      const openaiJson= message.content[0].text.value
      const jsonObject= JSON.parse(openaiJson)
      const operacion= jsonObject.operacion ? jsonObject.operacion.toUpperCase() : undefined
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
      if (!updated) {
        throw new Error("updated is null")
      }
      console.log("updated:")
      console.log(updated)
    }
  })   
  
  return true
}

// function parsearSolicitudAlquiler(jsonString: string): JSONOpenAI | null {
//   try {
//       const solicitud: JSONOpenAI = JSON.parse(jsonString);
//       // Aquí puedes agregar validaciones adicionales si es necesario
//       return solicitud;
//   } catch (error) {
//       console.error("Error al parsear el JSON: ", error);
//       return null;
//   }
// }

// type JSONOpenAI = {
//   operacion: "ALQUILER" | "VENTA"
//   tipo: "Casa" | "Apartamento" | "Terreno" | "Local"
//   presupuesto: string;
//   zona: string;
//   dormitorios: string;
//   caractertisticas: string;
//   contacto: string;
// };