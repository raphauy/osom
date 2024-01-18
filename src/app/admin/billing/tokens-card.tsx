import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Disc } from "lucide-react";

type Props = {
    promptTokens: number
    completionTokens: number
}

export default function TokensCard({ promptTokens, completionTokens }: Props) {
    const totalTokens = promptTokens + completionTokens
  return (
    <Card className={cn("flex flex-col", totalTokens === 0 && "opacity-20")}>
        <CardHeader>
        <CardDescription>
            <div className="flex justify-between">
            <p>Total de Tokens</p>
            <Disc />
            </div>
        </CardDescription>
        <CardTitle>
            <div className="flex items-center justify-between">
            <p>{Intl.NumberFormat("es-UY").format(totalTokens)}</p>
            </div>
        </CardTitle>
        </CardHeader>
        <CardHeader>
        <CardTitle>
            <div className="flex items-center justify-between">
            <p className="text-lg text-muted-foreground">{Intl.NumberFormat("es-UY").format(promptTokens)}</p>
            <p className="text-lg text-muted-foreground">{Intl.NumberFormat("es-UY").format(completionTokens)}</p>
            </div>
        </CardTitle>
        <CardDescription>
            <div className="flex justify-between">
            <p>Prompt</p>
            <p>Completion</p>
            </div>
        </CardDescription>
        </CardHeader>
    </Card>
    )
}
