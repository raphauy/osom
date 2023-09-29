import { OpenAI } from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { functions, runFunction } from "../../../services/functions"
import { NextResponse } from "next/server";
import { getSystemMessage, getSystemMessageForSocialExperiment } from "@/services/conversationService";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

//export const runtime = "edge";

export async function POST(req: Request) {

  const { messages } = await req.json()
  console.log(messages)

  const reqUrl= req.headers.get("referer");
  console.log("reqUrl: " + reqUrl);

  if (reqUrl?.endsWith("experimento")) {
    messages.unshift(getSystemMessageForSocialExperiment())
  } else {
    messages.unshift(getSystemMessage())
  }
  

  // check if the conversation requires a function call to be made
  const initialResponse = await openai.chat.completions.create({
    //model: "gpt-3.5-turbo-0613",
    model: "gpt-4-0613",
    messages,
    temperature: 0,
    stream: true,
    functions,
    function_call: "auto",
  })

  const clientId = "clm865amy0009jepxozqh2ff9"

  const stream = OpenAIStream(initialResponse, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages,
    ) => {
      const result = await runFunction(name, args, clientId);
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
