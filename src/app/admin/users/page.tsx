
import { Button } from "@/components/ui/button"
import getUsers from "@/services/userService"
import { PlusCircle } from "lucide-react"
import { create, getDataUsers, update } from "./(crud)/actions"
import { UserDialog } from "./(crud)/user-dialog"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getDataClients } from "../clients/(crud)/actions"
 
export default async function WinesPage() {
  
  const users= await getDataUsers()

  const addTrigger= (<Button><PlusCircle size={22} className="mr-2"/>Agregar</Button>)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <UserDialog create={create} update={update} title="Agregar Usuario" trigger={addTrigger}/>
      </div>

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={users} />      
      </div>
    </div>
)
}
