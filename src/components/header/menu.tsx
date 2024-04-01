
import { getCurrentUser } from "@/lib/auth";
import MenuAdmin from "./menu-admin";
import MenuOsom from "./menu-osom";
import getClients from "@/services/clientService";
import { InmoSelector, SelectorData } from "./inmo-selector";

export default async function Menu() {
    
    const user= await getCurrentUser()

    if (!user) return <div></div>

    const inmobiliarias= await getClients()
    const selectorData: SelectorData[]= inmobiliarias.map(inmobiliaria => ({slug: inmobiliaria.slug, name: inmobiliaria.name}))

    if (user.role === "admin") 
        return (
            <div className="flex">
                <div className="flex">
                    <InmoSelector selectors={selectorData} />
                    <MenuAdmin />
                    {/* <MenuOsom /> */}
                </div>
            </div>
        )

    return (
        <div></div>
    );
}
