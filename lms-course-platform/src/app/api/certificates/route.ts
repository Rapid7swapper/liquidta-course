import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    const { data: certificates, error } = await supabase
      .from('certificates')
      .select(`
        *,
        enrollments (
          *,
          courses (*)
        )
      `)
      .eq('enrollments.user_id', userId);

    if (error) throw error;

    return NextResponse.json(certificates);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}
