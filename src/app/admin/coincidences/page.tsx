import { getAllCoincidencesDAO, getCoincidencesDAO } from "@/services/coincidence-services";
import { CoincidenceDialog } from "./coincidence-dialogs";
import { DataTable } from "./coincidence-table";
import { columns } from "./coincidence-columns";

export default async function UsersPage() {
  const data = await getAllCoincidencesDAO();

  return (
    <div className="w-full">
      <div className="flex justify-end mx-auto my-2">
        <CoincidenceDialog />
      </div>

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Coincidence" />
      </div>
    </div>
  );
}
