import { getClientBySlug } from "@/services/clientService"
import { getDataConversation } from "../actions"
import clsx from "clsx"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Bot, CircleDollarSign, User } from "lucide-react"
import GPTData from "./gpt-data"
import { getCurrentUser } from "@/lib/auth"
import { parse } from "path"
import { formatPresupuesto } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Props {
    params: {
      id: string
    }
  }
  
export default async function ChatPage({ params: { id } }: Props) {

    const user= await getCurrentUser()

    const conversation= await getDataConversation(id)
    if (!conversation) return <div>Chat no encontrado</div>
    const totalPromptTokens= conversation.messages.reduce((acc, message) => acc + message.promptTokens, 0)
    const totalCompletionTokens= conversation.messages.reduce((acc, message) => acc + message.completionTokens, 0)
    const promptTokensValue= totalPromptTokens / 1000 * 0.01
    const completionTokensValue= totalCompletionTokens / 1000 * 0.03

    const transformedMessages= conversation.messages.map(message => {
        if (message.content.includes("**")) return message
        if (message.content.includes("*")) {
            const newContent= message.content.replace(/\*/g, "**")
            return {...message, content: newContent}
        }
        
        return message
    })

    const similarityThreshold: number= parseFloat(process.env.SIMILARITY_THRESHOLD || "0.5")

    const isAdmin= user?.role === "admin"
    console.log(format(new Date(), "MM-dd HH:mm:ss", {locale: es}), user?.name)    

    return (
        <main className="flex flex-col items-center justify-between w-full p-3 border-l">
          <div className="w-full pb-2 text-center border-b">
            <p className="text-lg font-bold">{conversation.celular} ({conversation.fecha})</p>
            {
              totalPromptTokens > 0 && isAdmin && (
                <div className="flex items-center justify-center gap-2">
                  <p>Tokens:</p>
                  <p>{Intl.NumberFormat("es-UY").format(totalPromptTokens)}</p>
                  <p>+</p>
                  <p>{Intl.NumberFormat("es-UY").format(totalCompletionTokens)}</p>
                  <p>=</p>
                  <p>{Intl.NumberFormat("es-UY").format(totalPromptTokens + totalCompletionTokens)}</p>
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <CircleDollarSign size={18} />
                  <p>{Intl.NumberFormat("es-UY").format(promptTokensValue + completionTokensValue)} USD</p>
                </div>                  
              )
            }
            {
              conversation.operacion && (
                <div className="flex items-center justify-center gap-2">Última búsqueda: 
                  <p className="font-bold">{conversation.operacion?.toUpperCase()},</p>
                  <p className="font-bold">{conversation.tipo?.toLocaleLowerCase()},</p>
                  <p className="font-bold">{conversation.zona},</p>
                  <p className="font-bold">{formatPresupuesto(conversation.presupuesto)}</p>
                </div>
              )
            }
          </div>  
          {
            transformedMessages.map((message, i) => (
              <div key={i} className="w-full">
                <div className={clsx(
                    "flex w-full items-center justify-center border-b border-gray-200 py-5",
                    message.role === "user" ? "bg-white" : "bg-gray-100",
                  )}
                >
                  <div className="flex items-center w-full max-w-screen-md px-5 space-x-4 sm:px-0">
                    <div className="flex flex-col">
                      <div
                          className={clsx(
                          "p-1.5 text-white",
                          message.role === "assistant" ? "bg-green-500" : "bg-black",
                          )}
                      >
                          {message.role === "user" ? (
                          <User width={20} />
                          ) : (
                          <Bot width={20} />
                          )}                    
                      </div>
                      <p className="text-sm">{message.fecha}</p>
                    </div>
                    <ReactMarkdown
                          className="w-full prose break-words prose-p:leading-relaxed"
                          remarkPlugins={[remarkGfm]}
                          components={{
                          // open links in new tab
                          a: (props) => (
                              <a {...props} target="_blank" rel="noopener noreferrer" />
                          ),
                          }}
                      >
                          {message.content}
                      </ReactMarkdown>
                  </div>
                  {
                    message.promptTokens > 0 && isAdmin && (
                      <div className="grid text-right">
                        <p>Tokens:</p>
                        <p>{Intl.NumberFormat("es-UY").format(message.promptTokens)}</p>
                        <p>{Intl.NumberFormat("es-UY").format(message.completionTokens)}</p>
                      </div>
                    )
                  }
                </div>
                {
                  message.gptData && isAdmin && (
                    <GPTData gptData={message.gptData} similarityThreshold={similarityThreshold} />
                  )
                }
                
              </div>

            ))
          }        
          
    
        </main>
      );
    }
    