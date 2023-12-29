"use user"

import { LoadingSpinnerChico } from "@/components/loadingSpinner";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { deleteAllPropertiesOfClientAction } from "./actions";

interface Props {
  clientId: string
  closeDialog: () => void
}

export default function DeleteForm({ clientId, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    deleteAllPropertiesOfClientAction(clientId)
    .then((data) => {
      if (!data) return
      toast({title: "Propiedades eliminadas" })
      closeDialog && closeDialog()
    })
    .catch((error) => {
      toast({title: error.message })
    })
    .finally(() => {
      setLoading(false)
    })
    

  }
  
  return (
    <div>
      <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
      <Button onClick={handleClick} variant="destructive" className="w-32 ml-2">
      {
          loading ? 
          <LoadingSpinnerChico /> :
          <p>Eliminar</p>
        }
      </Button>
    </div>
  )
}
