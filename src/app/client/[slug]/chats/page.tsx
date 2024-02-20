"use client"

import { DataClient, getDataClientBySlug } from "@/app/admin/clients/(crud)/actions"
import { Loader } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { DataConversation, getDataConversationAction, getDataConversations, getLastDataConversationAction } from "./actions"
import { columns } from "./columns"
import ConversationBox from "./conversation-box"
import { DataTable } from "./data-table"

interface Props {
  params: {
    slug: string
  }
  searchParams: {
    id: string
  }
}
  
export default function ChatPage({ searchParams: { id }, params: { slug } }: Props) {
  const session= useSession()

  const [loadingConversations, setLoadingConversations] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)

  const [conversation, setConversation] = useState<DataConversation>()
  const [client, setClient] = useState<DataClient>()
  const [dataConversations, setDataConversations] = useState<DataConversation[]>([])

  useEffect(() => {
    setLoadingChat(true)

    if (!id) {
      if (!slug) return
  
      getLastDataConversationAction(slug)
      .then(conversation => {
        if (conversation) setConversation(conversation)
      })    
      .catch(error => console.log(error))
      .finally(() => setLoadingChat(false))
    } else {
      getDataConversationAction(id)
      .then(conversation => {
        if (conversation) setConversation(conversation)
      })
      .catch(error => console.log(error))
      .finally(() => setLoadingChat(false))
    }

    

  }, [id, slug])
  

  useEffect(() => {
    setLoadingConversations(true)

    getDataClientBySlug(slug)
    .then(client => {
      if (client) {
        setClient(client)
        getDataConversations(client.id)
        .then(data => {
          if (data) setDataConversations(data)
        })
        .catch(error => console.log(error))
        .finally(() => setLoadingConversations(false))
      }
    })
    .catch(error => console.log(error))
    .finally(() => setLoadingConversations(false))
    

  }, [slug])
  


  if (!conversation) return <Loader className="w-6 h-6 mx-auto animate-spin" />

  const similarityThreshold: number= parseFloat("0.5")

  const user= session.data?.user

  const isAdmin= user?.role === "admin"

  // if (!client) 
  //   return <Loader className="w-6 h-6 mx-auto animate-spin" />

  return (
    <div className="flex flex-grow w-full">
      <div className="w-72">

        {
          loadingConversations ? 
            <Loader className="w-6 h-6 mx-auto animate-spin" /> :
            <div className="p-3 py-4 mx-auto text-muted-foreground dark:text-white">
                <DataTable columns={columns} data={dataConversations} />
            </div> 
        }
          

      </div>

      <div className="flex flex-col items-center flex-grow p-1">
        {
          loadingChat ?
          <Loader className="w-6 h-6 animate-spin" /> :
          <ConversationBox conversation={conversation} isAdmin={isAdmin} similarityThreshold={similarityThreshold} /> 
        }
        
      </div>
    </div>

    );
  }
    