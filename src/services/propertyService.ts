import { Percentages } from "@/app/admin/clients/(crud)/actions";
import { prisma } from "@/lib/db";

export default async function getPropertys() {

  const found = await prisma.property.findMany({
    orderBy: {
      idPropiedad: 'asc',
    },
  })

  return found;
}

export async function getPropertiesOfClient(clientId: string) {

  const found = await prisma.property.findMany({
    where: {
      clientId
    },
    orderBy: {
      idPropiedad: 'asc',
    },
  })

  return found;
}

export async function getPercentages(clientId: string): Promise<Percentages> {
  
    const found = await prisma.property.findMany({
      where: {
        clientId
      },
      select: {
        enVenta: true,
        enAlquiler: true,
      },
    })
  
    const sales = found.filter((property) => property.enVenta === 'si').length
    const rents = found.filter((property) => property.enAlquiler === 'si').length
  
    return {
      sales: `${sales}`,
      rents: `${rents}`,
    }
}


export async function getProperty(id: string) {

  const found = await prisma.property.findUnique({
    where: {
      id
    },
  })

  return found
}

export async function getPropertiesCount(clientId: string) {

  const found = await prisma.property.count({
    where: {
      clientId
    },
  })

  return found  
}