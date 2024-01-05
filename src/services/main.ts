import { prisma } from "@/lib/db"
import { start } from "./embeddingService"
import { updateEmbedding, updateEmbeddingProyecto } from "./propertyService"
//import { start } from "./osomService"

async function main() {
  //start()

  const proyectos= await prisma.property.findMany({
    where: {
      tipo: "Emprendimiento"
    }
  })

  console.log("cant. proyectos: " + proyectos.length)
  
  for (const proyecto of proyectos) {
    const nombre= proyecto.titulo
    const id= proyecto.id
    if (nombre)
      await updateEmbedding(id)
  }
}
  
main()
  