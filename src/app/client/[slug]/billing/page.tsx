import { Billing } from "@/app/admin/billing/billing"
import { getClientBySlug } from "@/services/clientService"

type Props = {
  params: {
    slug: string
  }
}
export default async function BillingPage({ params }: Props) {
  const slug = params.slug
  const client= await getClientBySlug(slug)
  if (!client) {
    return <div>Client not found</div>
  }
  
  return (
    <div className="w-full h-full">
        <Billing clientId={client.id} />
    </div>
  )
}
