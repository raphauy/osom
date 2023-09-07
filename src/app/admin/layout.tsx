import { getCurrentUser } from "@/lib/auth";
import NotAlowedPage from "../(auth)/unauthorized/page";
import SideBar from "./sideBar";

interface Props {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: Props) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return <NotAlowedPage message="You must be logged in." />
  }

  if (currentUser?.role !== "admin") {
    return <NotAlowedPage message="Only admin role allowed." />
  }

  return (
    <>
      <div className="flex flex-grow w-full">
        <SideBar />
        <div className="flex flex-col items-center flex-grow p-1">{children}</div>
      </div>
    </>
  )
}
