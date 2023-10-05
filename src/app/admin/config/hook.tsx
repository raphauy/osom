"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import useCopyToClipboard from "@/lib/useCopyToClipboard"
import { Copy, Edit } from "lucide-react"
import { useEffect, useState } from "react"
import { EndpointDialog } from "./(crud)/endpoint-dialog"
import { getDataClient, updateEndpoint } from "../clients/(crud)/actions"
import { usePathname } from "next/navigation"

interface Props {
    clientId: string
}

export default function Hook({ clientId }: Props) {

    const [value, copy] = useCopyToClipboard()
    const [hook, setHook] = useState(`https://osom.rapha.uy/api/${clientId}/conversation`)
    const [endPoint, setEndPoint] = useState("No configurado")
    const [updateAPIEndpoint, setUpdateAPIEndpoint] = useState(`https://osom.rapha.uy/api/${clientId}/update`)

    useEffect(() => {
        getDataClient(clientId).then((data) => {
            if (!data) return
            data.whatsAppEndpoint && setEndPoint(data.whatsAppEndpoint)
        })

        const host= window.location.host
        const port= window.location.port
        let basePath= "https://" + host
        if (host === "localhost") basePath= "http://localhost:" + port
        
        setHook(`${basePath}/api/${clientId}/conversation`)        
        setUpdateAPIEndpoint(`${basePath}/api/${clientId}/update`)
        
    }, [clientId])
    

    function copyHookToClipboard(){   
        copy(hook)    
        toast({title: "Hook copiado" })
    }

    function copyEndPointToClipboard(){   
        copy(endPoint)    
        toast({title: "Endpoint copiado" })
    }

    function copyUpdateAPIEndpointIdToClipboard(){   
        copy(updateAPIEndpoint)    
        toast({title: "Update API Endpoint copiado" })
    }

    const editTrigger= (<Edit size={30} className="pr-2 hover:cursor-pointer"/>)

    return (
        <div>
            <div className="flex items-end gap-4 pb-3 mb-3 border-b">
                <p className="mt-5"><strong>Entrante</strong>: {hook}</p>
                <Button variant="ghost" className="p-1 h-7"><Copy onClick={copyHookToClipboard} /></Button>
            </div>

            <div className="flex items-center gap-4 pb-3 mb-3 border-b">
                <p><strong>Saliente</strong>: {endPoint}</p>
                <EndpointDialog update={updateEndpoint} title="Configurar WhatsApp Endpoint" trigger={editTrigger} id={clientId} />
                <Button variant="ghost" className="p-1 h-7"><Copy onClick={copyEndPointToClipboard} /></Button>
            </div>

            <div className="flex items-center gap-4 pb-3 mb-3 border-b">
                <p><strong>Update API Endpoint</strong>: {updateAPIEndpoint}</p>
                <Button variant="ghost" className="p-1 h-7"><Copy onClick={copyUpdateAPIEndpointIdToClipboard} /></Button>
            </div>
        </div>
    )
}
