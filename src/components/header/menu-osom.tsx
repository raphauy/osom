"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { usePathname, useSearchParams } from "next/navigation";
import { DataClient, getDataClients } from "@/app/admin/clients/(crud)/actions";
import { useEffect, useState } from "react";

export default function MenuOsom() {
    const path= usePathname()
    const [clients, setClients] = useState<DataClient[]>([])
    const searchParams= useSearchParams()

    useEffect(() => {
        console.log("path", path)      
        
        getDataClients().then(setClients)
    }, [searchParams, path])

    return (
        <div className="flex flex-1 gap-6 pl-5 md:gap-5 ">
            <nav>
                <ul className="flex items-center">
                    {clients.map(client => (
                        <li key={client.id} className={`flex items-center border-b-osom-color hover:border-b-osom-color hover:border-b-2 h-11 whitespace-nowrap ${path.includes(client.slug) && "border-b-2"}`}>
                            <Link href={`/client/${client.slug}`}><Button className="text-lg" variant="ghost">{client.nombre}</Button></Link>
                        </li>
                        ))
                    }
                </ul>
            </nav>
        </div>
    );
}
