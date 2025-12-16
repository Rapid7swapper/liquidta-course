import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: progress, error } = await supabase
      .from('lesson_progress')
      .select(`
        *,
        lessons (*),
        enrollments (
          *,
          courses (*)
        )
      `)
      .eq('enrollments.user_id', user.id);

    if (error) throw error;

    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
