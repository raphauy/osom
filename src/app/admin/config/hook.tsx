"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import useCopyToClipboard from "@/lib/useCopyToClipboard"
import { Copy } from "lucide-react"
import { useState } from "react"

interface Props {
    clientId: string
}

export default function Hook({clientId}: Props) {

    const [value, copy] = useCopyToClipboard()
    const [hook, setHook] = useState(`https://osom.rapha.uy/api/${clientId}/conversation`)

    function copyHookToClipboard(){   
        copy(hook)    
        toast({title: "Hook copiado" })
    }

    return (
        <div className="flex items-end gap-4">
            <p className="mt-5">{hook}</p>
            <Button variant="ghost" className="p-1 h-7"><Copy onClick={copyHookToClipboard} /></Button>
        </div>
    )
}
