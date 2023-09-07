import { ClientFormValues } from "@/app/admin/clients/(crud)/clientForm";
import { prisma } from "@/lib/db";



export default async function getClients() {

  const found = await prisma.client.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      users: true
    }
  })

  return found;
};


export async function getClient(id: string) {

  const found = await prisma.client.findUnique({
    where: {
      id
    },
  })

  return found
}

export async function getClientBySlug(slug: string) {

  const found = await prisma.client.findUnique({
    where: {
      slug
    },
    include: {
      users: true
    }
  })

  return found
}

export async function createClient(data: ClientFormValues) {
  
  const slug= data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  const created= await prisma.client.create({
    data: {
      ...data,
      slug
    }
  })

  return created
}

export async function editClient(id: string, data: ClientFormValues) {
  console.log(data);
  
  const created= await prisma.client.update({
    where: {
      id
    },
    data
  })

  return created
}

export async function deleteClient(id: string) {
  
  const deleted= await prisma.client.delete({
    where: {
      id
    },
  })

  return deleted
}