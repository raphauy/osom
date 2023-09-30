import { prisma } from "@/lib/db";

import { OpenAI } from "openai"
import { functions, getProperties, notifyHuman, runFunction } from "./functions";
import { ChatCompletionMessageParam } from "openai/resources/chat/index.mjs";
import { sendWapMessage } from "./osomService";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function getConversations() {

  const found = await prisma.conversation.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      client: true
    }
  })

  return found;
}

export async function getConversationsOfClient(clientId: string) {

  const found = await prisma.conversation.findMany({
    where: {
      clientId
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      client: true,
      messages: true
    }
  })

  return found;
}

// an active conversation is one that was updated in the last 10 minutes
export async function getActiveConversation(phone: string, clientId: string) {
  
    const found = await prisma.conversation.findFirst({
      where: {
        phone,
        clientId,        
        updatedAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000)
        }        
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        client: true
      }
    })
  
    return found;
}


export async function getConversation(id: string) {

  const found = await prisma.conversation.findUnique({
    where: {
      id
    },
    include: {
      client: true,
      messages:  {
        orderBy: {
          createdAt: 'asc',
        },
      }
    },
  })

  return found
}

// find an active conversation or create a new one to connect the messages
export async function messageArrived(phone: string, text: string, clientId: string, role: string) {

  const activeConversation= await getActiveConversation(phone, clientId)
  if (activeConversation) {
    const message= await createMessage(activeConversation.id, role, text)
    return message    
  } else {
    const created= await prisma.conversation.create({
      data: {
        phone,
        clientId,
      }
    })
    const message= await createMessage(created.id, role, text)
    return message   
  }
}


export async function processMessage(id: string) {
  const message= await prisma.message.findUnique({
    where: {
      id
    },
    include: {
      conversation: {
        include: {
          messages: true,
        }
      }
    }
  })
  if (!message) throw new Error("Message not found")

  const conversation= message.conversation
  const messages= getGPTMessages(conversation.messages as ChatCompletionMessageParam[])

  console.log("gptMessages: ", messages)

  // check if the conversation requires a function call to be made
  const initialResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    //model: "gpt-4-0613",
    messages: messages,
    temperature: 0,
    functions,
    function_call: "auto",
  })

  let wantsToUseFunction = initialResponse.choices[0].finish_reason == "function_call"

  console.log("wantsToUseFunction: ", wantsToUseFunction)
  

  let assistantResponse: string | null = ""
	let content = ""
  let notificarAgente = false
	// Step 2: Check if ChatGPT wants to use a function
	if(wantsToUseFunction){
		// Step 3: Use ChatGPT arguments to call your function
    if (!initialResponse.choices[0].message.function_call) throw new Error("No function_call message")

		if(initialResponse.choices[0].message.function_call.name == "getProperties"){
			let argumentObj = JSON.parse(initialResponse.choices[0].message.function_call.arguments)      
      const description= argumentObj.description
      console.log('description: ', description)      
			content = await getProperties(description, conversation.clientId)
			messages.push(initialResponse.choices[0].message)
			messages.push({
				role: "function",
				name: "getProperties", 
				content: JSON.stringify(content),
			})

    }
		if(initialResponse.choices[0].message.function_call.name == "notifyHuman"){
			content = await notifyHuman(conversation.clientId)
			messages.push(initialResponse.choices[0].message)
			messages.push({
				role: "function",
				name: "getProperties", 
				content: JSON.stringify(content),
			})
      notificarAgente = true
		}

    // second invocation of ChatGPT to respond to the function call
    let step4response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0613",
      messages,
    });
    assistantResponse = step4response.choices[0].message.content
    
	} else {
    assistantResponse = initialResponse.choices[0].message.content    
  }

  console.log("assistantResponse: ", assistantResponse)  

  if (assistantResponse) {
    await messageArrived(conversation.phone, assistantResponse, conversation.clientId, "assistant")
    console.log("message stored")
  }

  if (assistantResponse) {
    sendWapMessage(conversation.phone, assistantResponse, notificarAgente, conversation.clientId)
  } else {
    console.log("assistantResponse is null")
  }   
  
  
}

function getGPTMessages(messages: ChatCompletionMessageParam[]) {
  const gptMessages: ChatCompletionMessageParam[]= [getSystemMessageV2()]
  for (const message of messages) {
    gptMessages.push({
      role: message.role,
      content: message.content,
    })
  }
  return gptMessages
}

export function getSystemMessage() {
  const systemMessage: ChatCompletionMessageParam= {
    role: "system",
    content: `Eres un asistente inmobiliario,
    tu objetivo es indentificar la intención del usuario y responderle con la información que necesita.
    Si hace falta alguna información clave para buscar una propiedad como la ubicación, el precio o el tipo de propiedad, puedes preguntarle al usuario por esa información.
    Debes filtrar la información de propiedades que no coincidan con la intención del usuario.
    Solo debes contestar con información de las propiedades, no debes inventar nada.
    Es muy importante que la zona o ciudad o departamente de las respuestas coincidan con la intención del usuario.
    Si el usuario pide algo en Punta del Este, no le puedes responder con propiedades en Montevideo.
    Pocitos es un barrio de Montevideo.
    Si la intención del usuario es hablar con un humano o hablar con un agente inmobiliario o agendar una visita, debes notificar a un agente inmobiliario utilizando la función 'notifyHuman'.
    Las respuestas que contengan propiedades deben poner el título en negrita con un solo asterisco (ejemplo: texto en *negrita*) seguido de la url pelada (no usar el formato markdown para links).)`,
  }
  return systemMessage
  
}

export function getSystemMessageV2() {
  const systemMessage: ChatCompletionMessageParam= {
    role: "system",
    content: `Eres un asistente inmobiliario,
    tu objetivo es indentificar la intención del usuario y responderle con la información que necesita.    
    Debes preguntarle al usuario por las características de la propiedad que está buscando y luego utilizar la función 'getProperties' para obtener las propiedades sugeridas para esas características.
    Características principales: tipo (casa, apartamento, terreno, local, etc), operación (alquilar o venta), valor aproximado (para venta o alquiler según corresponda) y zona (barrio, departamento o ciudad)
    Características opcionales: dormitorios,  banios,  garages, parrilleros, piscinas, calefaccion, amueblada, seguridad, asensor, lavadero, gastosComunes, etc.
    Luego de obtener las propiedades sugeridas debes utilizar las que coincidan con las características proporcionadas por el usuario.
    Solo debes utilizar la información de las propiedades, no debes inventar nada.
    Es muy importante que la zona (barrio, departamento o ciudad) de las respuestas coincidan con la zona proporcionada por el usuario.    
    Si la intención del usuario es hablar con un humano o hablar con un agente inmobiliario o agendar una visita, debes notificar a un agente inmobiliario utilizando la función 'notifyHuman'.
    Las respuestas que contengan propiedades deben poner el título en negrita con un solo asterisco (ejemplo: texto en *negrita*) seguido de la url pelada (no usar el formato markdown para links).)`,
  }
  return systemMessage
  
}

export function getSystemMessageForSocialExperiment() {
  const systemMessage: ChatCompletionMessageParam= {
    role: "system",
    content: `Eres un asistente social que trabaja para la comuna.
    Debes hablar con acento uruguayo.
    Tu objetivo es dialogar con un vecino de barrio y averiguar cuáles son sus problemas y necesidades.
    Para lograr tu objetivo puedes preguntarle por aspectos de seguridad, sentimiento de pertenencia, servicios públicos, etc.
    Debes ser amable y empático.
    Debes ser paciente y tolerante.
    Debes ser respetuoso y no juzgar al vecino.
    Se quiere obtener información sobre el sentimiento de las personas, no sobre los barrios específicamente.
    Debes recopilar información mediante preguntas pertinentes y en función de las respuestas del usuario.
    La información recopilada en forma de diálogo entre tú y el vecino servirá para que la ONG pueda realizar un diagnóstico de la situación del barrio y del sentimiento ciudadano.`
  }
  return systemMessage
  
}

function createMessage(conversationId: string, role: string, content: string) {
  const created= prisma.message.create({
    data: {
      role,
      content,
      conversationId,
    }
  })

  return created
}
  


export async function updateConversation(id: string, role: string, content: string) {

  const newMessage= await prisma.message.create({
    data: {
      role,
      content,
      conversationId: id,
    }
  })
  
  const updated= await prisma.conversation.update({
    where: {
      id
    },
    data: {
      messages: {
        connect: {
          id: newMessage.id
        }
      }
    }
    })

  return updated
}


export async function deleteConversation(id: string) {
  
  const deleted= await prisma.conversation.delete({
    where: {
      id
    },
  })

  return deleted
}