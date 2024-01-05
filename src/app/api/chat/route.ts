import { getSystemMessage, getSystemMessageForSocialExperiment } from "@/services/conversationService";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { OpenAI } from "openai";
import { functions, runFunction } from "../../../services/functions";
import { getClient } from "@/services/clientService";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

//export const runtime = "edge";

export async function POST(req: Request) {

  const { messages, clientId } = await req.json()
  console.log(messages)
  console.log("clientId:" + clientId)

  const reqUrl= req.headers.get("referer");
  console.log("reqUrl: " + reqUrl);
  const isExperimento = reqUrl?.endsWith("experimento")

  if (isExperimento) {
    messages.unshift(getSystemMessageForSocialExperiment())
  } else {
    const client= await getClient(clientId)
    if (!client) {
      return new Response("Client not found", { status: 404 })
    }
    if (!client.prompt) {
      return new Response("Client prompt not found", { status: 404 })
    }
    messages.unshift(getSystemMessage(client.prompt))
  }


  

  // check if the conversation requires a function call to be made
  const initialResponse = await openai.chat.completions.create({
    //model: "gpt-3.5-turbo-0613",
    //model: "gpt-4-0613",
    model: "gpt-4-1106-preview",
    messages,
    temperature: 0,
    stream: true,
    functions,
    function_call: "auto",
  })

  //const clientId = "clm865amy0009jepxozqh2ff9"

  // @ts-ignore
  const stream = OpenAIStream(initialResponse, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages,
    ) => {
      const result = await runFunction(name, args, clientId);
      const newMessages = createFunctionCallMessages(result);
      return openai.chat.completions.create({
        //model: "gpt-3.5-turbo-0613",
        model: "gpt-4-1106-preview",
        stream: true,
        messages: [...messages, ...newMessages],
      });
    },
  });



  return new StreamingTextResponse(stream);
}
