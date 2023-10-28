import { ReactNode } from "react"
import Logo from "./logo"
import Logged from "./logged"
import getSession from "@/lib/auth"
import { ThemeToggle } from "../shadcn/theme-toggle"

interface Props {  
    children: ReactNode
}
  
export default async function Header({ children }: Props) {
    const session= await getSession()

    return (
        <div className="flex items-center gap-2 pb-1 border-b border-osom-color/50">
            <div>
                <Logo />
            </div>
            <div className="flex-1">                                
                {session && children}
            </div>
            
            <div>
                <ThemeToggle />
            </div>
            <div>
                <Logged />
            </div>
        </div>
    )
}
