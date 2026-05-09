"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Calendar, 
  Clock, 
  Save, 
  Plus, 
  Trash2,
  CheckCircle2,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"

const DAYS = [
  { id: 'mon', label: 'Monday' },
  { id: 'tue', label: 'Tuesday' },
  { id: 'wed', label: 'Wednesday' },
  { id: 'thu', label: 'Thursday' },
  { id: 'fri', label: 'Friday' },
  { id: 'sat', label: 'Saturday' },
  { id: 'sun', label: 'Sunday' },
]

export default function MentorAvailabilityPage() {
  const [availability, setAvailability] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('mentor_availability')
      .select('*')
      .eq('mentor_id', user.id)
    
    if (data) setAvailability(data)
    setLoading(false)
  }

  const addSlot = (day: string) => {
    setAvailability([...availability, { day_of_week: day, start_time: "09:00", end_time: "10:00", is_available: true }])
  }

  const removeSlot = (index: number) => {
    const newAvail = [...availability]
    newAvail.splice(index, 1)
    setAvailability(newAvail)
  }

  const saveAvailability = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Clear old availability and insert new
    await supabase.from('mentor_availability').delete().eq('mentor_id', user.id)
    
    const { error } = await supabase.from('mentor_availability').insert(
      availability.map(a => ({ ...a, mentor_id: user.id }))
    )

    if (error) {
      toast.error("Failed to save availability")
      setLoading(false)
      return
    }

    // Now generate session slots for the next 7 days based on this availability
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const slots = availability
      const sessionsToCreate = []
      
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() + i)
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase()
        
        const daySlots = slots.filter(s => s.day_of_week === dayName)
        
        for (const slot of daySlots) {
          sessionsToCreate.push({
            mentor_id: user.id,
            mentor_name: user.user_metadata?.full_name || "Expert",
            date: date.toISOString().split('T')[0],
            time_slot: `${slot.start_time} - ${slot.end_time}`,
            status: 'available',
            price: 499 // Default price
          })
        }
      }

      // Clear future available sessions and replace with new ones
      await supabase.from('sessions')
        .delete()
        .eq('mentor_id', user.id)
        .eq('status', 'available')
        .gte('date', new Date().toISOString().split('T')[0])

      if (sessionsToCreate.length > 0) {
        await supabase.from('sessions').insert(sessionsToCreate)
      }

      toast.success("Availability and session slots updated!")
    } catch (err) {
      console.error("Error generating sessions:", err)
      toast.error("Availability saved, but session generation failed")
    }
    
    setLoading(false)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-4xl font-black tracking-tighter mb-2">My <span className="text-primary">Availability.</span></h1>
              <p className="text-slate-500 font-medium">Set the times you are available for consultation calls.</p>
            </div>
            <Button onClick={saveAvailability} disabled={loading} className="rounded-2xl h-14 px-8 font-black gap-2 shadow-xl shadow-primary/20">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-5 w-5" /> Save Changes</>}
            </Button>
          </div>

          <div className="grid gap-6">
            {DAYS.map((day) => (
              <Card key={day.id} className="border-none rounded-[2rem] shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-black">{day.label}</h3>
                    </div>

                    <div className="flex-1 space-y-3">
                      {availability.filter(a => a.day_of_week === day.id).map((slot, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <input 
                            type="time" 
                            value={slot.start_time}
                            onChange={(e) => {
                              const newAvail = [...availability]
                              const slotIdx = availability.indexOf(slot)
                              newAvail[slotIdx].start_time = e.target.value
                              setAvailability(newAvail)
                            }}
                            className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 font-bold"
                          />
                          <span className="text-slate-400 font-black">to</span>
                          <input 
                            type="time" 
                            value={slot.end_time}
                            onChange={(e) => {
                              const newAvail = [...availability]
                              const slotIdx = availability.indexOf(slot)
                              newAvail[slotIdx].end_time = e.target.value
                              setAvailability(newAvail)
                            }}
                            className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 font-bold"
                          />
                          <Button variant="ghost" size="icon" onClick={() => removeSlot(availability.indexOf(slot))} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addSlot(day.id)} className="rounded-xl border-dashed border-2 font-bold gap-2">
                        <Plus className="h-4 w-4" /> Add Time Slot
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </AuthGuard>
  )
}
