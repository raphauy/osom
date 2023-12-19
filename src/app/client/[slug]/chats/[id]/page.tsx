import { getClientBySlug } from "@/services/clientService"
import { getDataConversation } from "../actions"
import clsx from "clsx"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Bot, User } from "lucide-react"
import GPTData from "./gpt-data"
import { getCurrentUser } from "@/lib/auth"
import { parse } from "path"
import { formatPresupuesto } from "@/lib/utils"

interface Props {
    params: {
      id: string
    }
  }
  
export default async function ChatPage({ params: { id } }: Props) {

    const user= await getCurrentUser()

    const conversation= await getDataConversation(id)
    if (!conversation) return <div>Chat no encontrado</div>

    const transformedMessages= conversation.messages.map(message => {
        if (message.content.includes("**")) return message
        if (message.content.includes("*")) {
            const newContent= message.content.replace(/\*/g, "**")
            return {...message, content: newContent}
        }
        
        return message
    })

    const similarityThreshold: number= parseFloat(process.env.SIMILARITY_THRESHOLD || "0.5")

    return (
        <main className="flex flex-col items-center justify-between w-full p-3 border-l">
          <div className="w-full pb-2 text-center border-b">
            <p className="text-lg font-bold">{conversation.celular} ({conversation.fecha})</p>
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
                </div>
                {
                  message.gptData && user?.role === "admin" && (
                    <GPTData gptData={message.gptData} similarityThreshold={similarityThreshold} />
                  )
                }
                
              </div>

            ))
          }        
          
    
        </main>
      );
    }
    