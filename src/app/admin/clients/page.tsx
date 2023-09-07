
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { create, getDataClients, update } from "./(crud)/actions"
import { ClientDialog } from "./(crud)/client-dialog"
import { columns } from "./columns"
import { DataTable } from "./data-table"
 
export default async function WinesPage() {
  
  const clients= await getDataClients()

  const addTrigger= (<Button><PlusCircle size={22} className="mr-2"/>Agregar</Button>)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <ClientDialog create={create} update={update} title="Agregar Cliente" trigger={addTrigger}/>
      </div>

      <div className="container p-3 py-10 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={clients} />      
      </div>
    </div>
)
}
