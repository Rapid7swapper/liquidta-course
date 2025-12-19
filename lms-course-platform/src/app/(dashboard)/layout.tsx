import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { InactivityHandler } from "@/components/InactivityHandler";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
      <InactivityHandler
        warningTimeout={115}  // Show warning at 1h 55m
        logoutTimeout={120}   // Auto-logout at 2 hours
      />
      {children}
    </>
  );
}
