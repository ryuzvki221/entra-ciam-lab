import {getCurrentSession} from "@/lib/auth";
import { redirect } from "next/navigation";

import AccountProfile from "./_components/AccountProfile";

export default async function AccountPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/");
  }

  return <AccountProfile  session={session} />;
}