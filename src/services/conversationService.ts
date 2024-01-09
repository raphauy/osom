import { prisma } from "@/lib/db";

import { OpenAI } from "openai";
import { PropiedadResult, functions, getProperties, getPropertiesByMultipleURL, getPropertyByReference, getPropertyByURL, getProyecto, notifyHuman } from "./functions";
import { sendWapMessage } from "./osomService";
import { ChatCompletionMessageParam, ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam } from "openai/resources/index.mjs";
import { set } from "date-fns";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  //organization: "org-"
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


// an active conversation is one that has a message in the last 10 minutes
export async function getActiveConversation(phone: string, clientId: string) {
    
    const found = await prisma.conversation.findFirst({
      where: {
        phone,
        clientId,        
        messages: {
          some: {
            createdAt: {
              gte: new Date(Date.now() - 10 * 60 * 1000)
            }
          }
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
export async function messageArrived(phone: string, text: string, clientId: string, role: string, gptData: string) {

  const activeConversation= await getActiveConversation(phone, clientId)
  if (activeConversation) {
    const message= await createMessage(activeConversation.id, role, text, gptData)
    return message    
  } else {
    const created= await prisma.conversation.create({
      data: {
        phone,
        clientId,
      }
    })
    const message= await createMessage(created.id, role, text, gptData)
    return message   
  }
}

export interface gptPropertyData {
  titulo: string
  url: string
  distance: number
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
          client: true
        }
      }
    }
  })
  if (!message) throw new Error("Message not found")

  const conversation= message.conversation
  
  //const messages= getGPTMessages(conversation.messages as ChatCompletionMessageParam[])
  if (!conversation.client.prompt) throw new Error("Client not found")
  const messages: ChatCompletionMessageParam[]= getGPTMessages(conversation.messages as ChatCompletionUserOrSystem[], conversation.client.prompt)

  console.log("gptMessages: ", messages)

  // check if the conversation requires a function call to be made
  const initialResponse = await openai.chat.completions.create({
    //model: "gpt-3.5-turbo-0613",
    // model: "gpt-4-0613",
    model: "gpt-4-1106-preview",
    messages: messages,
    temperature: 0,
    functions,
    function_call: "auto",
  })

  let wantsToUseFunction = initialResponse.choices[0].finish_reason == "function_call"
  const usage= initialResponse.usage
  console.log("usage:")
  console.log(usage)  

  console.log("wantsToUseFunction: ", wantsToUseFunction)
  

  let assistantResponse: string | null = ""
	let content: PropiedadResult[] | string | PropiedadResult = []
  let notificarAgente = false
  let gptDataArray: gptPropertyData[] = []
	// Step 2: Check if ChatGPT wants to use a function
	if(wantsToUseFunction){
		// Step 3: Use ChatGPT arguments to call your function
    if (!initialResponse.choices[0].message.function_call) throw new Error("No function_call message")

		if(initialResponse.choices[0].message.function_call.name == "getProperties"){
			let argumentObj = JSON.parse(initialResponse.choices[0].message.function_call.arguments)      
      const description= argumentObj.description
      const tipo= argumentObj.tipo
      const operacion= argumentObj.operacion
      const presupuesto= argumentObj.presupuesto
      const zona= argumentObj.zona
			content = await getProperties(tipo, operacion, presupuesto, zona, description, conversation.clientId)

      content.forEach((item, index) => {
        console.log(`Título: ${item.titulo}`)
        console.log(`URL: ${item.url}`)
        console.log(`Distancia: ${item.distance.toFixed(2)}`)
      })

      gptDataArray= content.map((item) => {
        return {
          titulo: item.titulo,
          url: item.url,
          distance: parseFloat(item.distance.toFixed(3))
        }
      })

      const similarityThreshold= process.env.SIMILARITY_THRESHOLD ? parseFloat(process.env.SIMILARITY_THRESHOLD) : 0.5
      content= content.filter((item) => {
        return item.distance < similarityThreshold
      })

      console.log("properties count: ", content.length)
      

			messages.push(initialResponse.choices[0].message)
			messages.push({
				role: "function",
				name: "getProperties", 
				content: JSON.stringify(content),
			})

      await setSearch(conversation.id, operacion, tipo, presupuesto, zona)

    }
		if(initialResponse.choices[0].message.function_call.name == "notifyHuman"){
			content = await notifyHuman(conversation.clientId)
			messages.push(initialResponse.choices[0].message)
			messages.push({
				role: "function",
				name: "notifyHuman", 
				content: JSON.stringify(content),
			})
      notificarAgente = true
		}

    if(initialResponse.choices[0].message.function_call.name == "getPropertyByURL"){
			let argumentObj = JSON.parse(initialResponse.choices[0].message.function_call.arguments)      
      const url= argumentObj.url
			content = await getPropertyByURL(url, conversation.clientId)
			messages.push(initialResponse.choices[0].message)
			messages.push({
				role: "function",
				name: "getPropertyByURL", 
				content: JSON.stringify(content),
			})
      //notificarAgente = true
		}

    if(initialResponse.choices[0].message.function_call.name == "getPropertyByReference"){
      let argumentObj = JSON.parse(initialResponse.choices[0].message.function_call.arguments)      
      const reference= argumentObj.reference
      content = await getPropertyByReference(reference, conversation.clientId)
      messages.push(initialResponse.choices[0].message)
      messages.push({
        role: "function",
        name: "getPropertyByReference", 
        content: JSON.stringify(content),
      })
    }

    if(initialResponse.choices[0].message.function_call.name == "getProyecto"){
      let argumentObj = JSON.parse(initialResponse.choices[0].message.function_call.arguments)      
      const nombre= argumentObj.nombre
      content = await getProyecto(nombre, conversation.clientId)
      messages.push(initialResponse.choices[0].message)
      messages.push({
        role: "function",
        name: "getProyecto", 
        content: JSON.stringify(content),
      })

      gptDataArray= content.map((item) => {
        return {
          titulo: item.titulo,
          url: item.url,
          distance: parseFloat(item.distance.toFixed(3))
        }
      })
    }

    if(initialResponse.choices[0].message.function_call.name == "getPropertiesByMultipleURL"){
      let argumentObj = JSON.parse(initialResponse.choices[0].message.function_call.arguments)      
      const urlArray= argumentObj.urlArray
      content = await getPropertiesByMultipleURL(urlArray, conversation.clientId)
      messages.push(initialResponse.choices[0].message)
      messages.push({
        role: "function",
        name: "getPropertiesByMultipleURL", 
        content: JSON.stringify(content),
      })
    }

    // second invocation of ChatGPT to respond to the function call
    let step4response = await openai.chat.completions.create({
      //model: "gpt-3.5-turbo-0613",
      // model: "gpt-4-0613",
      model: "gpt-4-1106-preview",
      messages,
    });
    assistantResponse = step4response.choices[0].message.content
    
	} else {
    assistantResponse = initialResponse.choices[0].message.content    
  }

  console.log("assistantResponse: ", assistantResponse)  

  if (assistantResponse) {
    const gptDataString= JSON.stringify(gptDataArray)
    await messageArrived(conversation.phone, assistantResponse, conversation.clientId, "assistant", gptDataString)
    console.log("message stored")
  }

  if (assistantResponse) {
    sendWapMessage(conversation.phone, assistantResponse, notificarAgente, conversation.clientId)
  } else {
    console.log("assistantResponse is null")
  }   
  
  
}

type ChatCompletionUserOrSystem= ChatCompletionUserMessageParam | ChatCompletionSystemMessageParam

//function getGPTMessages(messages: (ChatCompletionUserMessageParam | ChatCompletionSystemMessageParam)[], clientPrompt: string) {
function getGPTMessages(messages: ChatCompletionUserOrSystem[], clientPrompt: string) {

  const systemPrompt= getSystemMessage(clientPrompt)

  // const gptMessages: ChatCompletionMessageParam[]= [systemPrompt]
  const gptMessages: ChatCompletionUserOrSystem[]= [systemPrompt]
  for (const message of messages) {
    let content= message.content
    if (Array.isArray(content)) {
      content= content.join("\n")
    } else if (content === null) {
      content= ""
    }

    gptMessages.push({
      role: message.role,
      content
    })
  }
  return gptMessages
}


export function getSystemMessage(prompt: string): ChatCompletionSystemMessageParam {
  const tecnicalContent= `
  - Cuando obtentas del usuario el tipo, operación, presupuesto y zona, creas una descripción de la propiedad con las características y utilizas la función 'getProperties'.
  - Si la intención del usuario es hablar con un humano o hablar con un agente inmobiliario o agendar una visita, debes notificar a un agente inmobiliario utilizando la función 'notifyHuman'.  
  `
  const content= prompt + "\n" + tecnicalContent
  console.log("systemPrompt: ", content)  

  const systemMessage: ChatCompletionMessageParam= {
    role: "system",
    content
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

function createMessage(conversationId: string, role: string, content: string, gptData?: string) {
  const created= prisma.message.create({
    data: {
      role,
      content,
      gptData,
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

export async function setSearch(id: string, operacion: string, tipo: string, presupuesto: string, zona: string) {

  const updated= await prisma.conversation.update({
    where: {
      id
    },
    data: {
      operacion,
      tipo,
      presupuesto,
      zona,
    }
    })

  return updated
}

export async function getLastSearch(clientId: string, phone: string){
  console.log("clientId: ", clientId)
  console.log("phone: ", phone)
  
  const found = await prisma.conversation.findFirst({
    where: {
      clientId,
      phone,
      operacion: {
        not: null
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return found

}

export async function deleteConversation(id: string) {
  
  const deleted= await prisma.conversation.delete({
    where: {
      id
    },
  })

  return deleted
}