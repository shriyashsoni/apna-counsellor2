import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { courseId, studentId, paymentId } = await request.json()
    if (!courseId || !studentId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('course_enrollments')
      .upsert({
        course_id: courseId,
        student_id: studentId,
        payment_id: paymentId || 'manual',
        status: 'active'
      }, { onConflict: 'course_id,student_id' })
      .select()

    if (error) {
      console.error("Enrollment DB Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, enrollment: data })
  } catch (err: any) {
    console.error("Enrollment Catch Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
