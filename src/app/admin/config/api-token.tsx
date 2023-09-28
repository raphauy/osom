"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import useCopyToClipboard from "@/lib/useCopyToClipboard"
import { Copy, Edit } from "lucide-react"
import { useEffect, useState } from "react"
import { EndpointDialog } from "./(crud)/endpoint-dialog"
import { update } from "./(crud)/actions"
import { getDataClient } from "../clients/(crud)/actions"

interface Props {
    apiToken: string
}

export default function APIToken({apiToken}: Props) {

    const [value, copy] = useCopyToClipboard()
    const [apiTokenValue, setApiTokenValue] = useState(apiToken)


    function copyApiTokenToClipboard(){   
        copy(apiTokenValue)    
        toast({title: "API token copiado" })
    }


    return (
        <div>
            <div className="flex items-end gap-4 pb-3 mb-3 border-b">
                <p className="mt-5"><strong>API token (Bearer)</strong>: {apiTokenValue}</p>
                <Button variant="ghost" className="p-1 h-7"><Copy onClick={copyApiTokenToClipboard} /></Button>
            </div>
        </div>
    )
}