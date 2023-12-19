
import { DataClient, getDataClient } from "../clients/(crud)/actions"
import BudgetPerc from "./budget-perc"
import Hook from "./hook"

type Props = {
    client: DataClient
}
export default async function ClientConfig({ client }: Props) {

    const BASE_PATH= process.env.NEXTAUTH_URL || "NOT-CONFIGURED"

    return (
        <div className="w-full mt-10 space-y-5 ">
            <div className="w-full space-y-7">
                <Hook basePath={BASE_PATH} />
                <BudgetPerc clientId={client.id} />
            </div>
        </div>
    )
}
