import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { SignOutButton } from "./components/sign-out-button";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }
  return (
    <div>
      <h1>dashboard</h1>
      <h1>{session?.user?.email}</h1>
      <h1>{session?.user?.name}</h1>
      <SignOutButton />
    </div>
  );
};

export default DashboardPage;
