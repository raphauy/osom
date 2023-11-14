
import { getCurrentUser } from "@/lib/auth";
import MenuAdmin from "./menu-admin";
import MenuOsom from "./menu-osom";

export default async function Menu() {
    
    const user= await getCurrentUser()

    if (!user) return <div></div>

    if (user.role === "admin") 
        return (
            <div className="flex">
                <div className="flex">
                    <MenuAdmin />
                </div>
            </div>
        )

    return (
        <div></div>
    );
}
