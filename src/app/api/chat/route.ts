import { OpenAI } from "openai";
import {
  OpenAIStream,
  StreamingTextResponse,
} from "ai";
import { functions, runFunction } from "./functions";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {

  const { messages } = await req.json()
  // insert a system message with instructions
  messages.unshift({
    role: "system",
    content: `Eres un asistente inmobiliario, 
    tu objetivo es indentificar la intención del usuario y responderle con la información que necesita. 
    Si hace falta alguna información clave para buscar una propiedad como la ubicación, el precio o el tipo de propiedad, puedes preguntarle al usuario por esa información. 
    Debes filtrar la información de propiedades que no coincidan con la intención del usuario.
    Solo debes contestar con información de las propiedades, no debes inventar nada.
    Es muy importante que la zona o ciudad o departamente de las respuestas coincidan con la intención del usuario.
    Si el usuario pide algo en Punta del Este, no le puedes responder con propiedades en Montevideo.`,
  });

  console.log(messages)
  

  // check if the conversation requires a function call to be made
  const initialResponse = await openai.chat.completions.create({
    //model: "gpt-3.5-turbo-0613",
    model: "gpt-4-0613",
    messages,
    temperature: 0,
    stream: true,
    functions,
    function_call: "auto",
  });

  const stream = OpenAIStream(initialResponse, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages,
    ) => {
      const result = await runFunction(name, args);
      const newMessages = createFunctionCallMessages(result);
      return openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        stream: true,
        messages: [...messages, ...newMessages],
      });
    },
  });

  return new StreamingTextResponse(stream);
}
