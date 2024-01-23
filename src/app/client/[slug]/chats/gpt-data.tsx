import { Button } from "@/components/ui/button"
import { gptPropertyData } from "@/services/conversationService"
import Link from "next/link"

interface Props {    
    gptData: string
    similarityThreshold: number
}

export default function GPTData({ gptData, similarityThreshold }: Props) {
    const data: gptPropertyData[] = JSON.parse(gptData)

    if (data.length === 0) return (<div></div>)

    return (
    <div className="w-full p-2 m-1 border rounded-md">
        {data.map((message, i) => {
            const color = i % 2 === 0 ? 'bg-blue-50' : 'bg-white'
            const distanceColor= message.distance > similarityThreshold ? 'text-red-500' : 'text-green-500'
            return (
            <Link key={i} className={`flex px-1 justify-between w-full ${color}`} href={message.url} target="_blank">
                <Button variant="link" className="h-6"><p>{message.titulo ? message.titulo : message.url}</p></Button>
                <p className={distanceColor}>{message.distance}
                </p>
            </Link>
        )})
        }
    </div>
    )
}
