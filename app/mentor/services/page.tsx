"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  ArrowLeft,
  LayoutGrid,
  Clock,
  DollarSign,
  Tag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"

export default function MentorServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('mentor_services')
      .select('*')
      .eq('mentor_id', user.id)
    
    setServices(data || [])
    setIsLoading(false)
  }

  const addService = () => {
    setServices([...services, { 
      title: "", 
      description: "", 
      price: 499, 
      duration_minutes: 45,
      is_active: true 
    }])
  }

  const removeService = (index: number) => {
    const newServices = [...services]
    newServices.splice(index, 1)
    setServices(newServices)
  }

  const updateService = (index: number, field: string, value: any) => {
    const newServices = [...services]
    newServices[index][field] = value
    setServices(newServices)
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Clear existing and insert new
      await supabase.from('mentor_services').delete().eq('mentor_id', user.id)
      
      const { error } = await supabase.from('mentor_services').insert(
        services.map(s => ({ ...s, mentor_id: user.id }))
      )

      if (error) throw error
      toast.success("Services updated successfully!")
    } catch (err: any) {
      toast.error(err.message || "Failed to save services")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <Link href="/mentor/dashboard">
                <Button variant="ghost" className="mb-4 -ml-4 text-slate-500 font-bold hover:text-primary">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
                </Button>
              </Link>
              <h1 className="text-4xl font-black tracking-tighter mb-2">My <span className="text-primary">Services.</span></h1>
              <p className="text-slate-500 font-medium">Define your consultation offerings and pricing.</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <Button onClick={addService} variant="outline" className="flex-1 md:flex-none rounded-2xl h-14 px-8 font-black border-2 border-dashed">
                <Plus className="mr-2 h-5 w-5" /> Add Service
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting} className="flex-1 md:flex-none rounded-2xl h-14 px-10 font-black shadow-xl shadow-primary/20">
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="mr-2 h-5 w-5" /> Save All</>}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {services.length === 0 ? (
              <Card className="p-20 text-center rounded-[3rem] bg-white border-none shadow-sm">
                 <LayoutGrid className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                 <p className="text-slate-400 font-bold">You haven't added any services yet.</p>
                 <Button onClick={addService} variant="link" className="text-primary font-black mt-2">Create your first offering</Button>
              </Card>
            ) : (
              services.map((service, index) => (
                <Card key={index} className="border-none rounded-[2.5rem] shadow-sm bg-white overflow-hidden group">
                  <div className="p-8 md:p-10">
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Service Title</label>
                            <Input 
                              placeholder="e.g. JEE Rank Analysis & College Preference" 
                              value={service.title}
                              onChange={(e) => updateService(index, 'title', e.target.value)}
                              className="rounded-xl bg-slate-50 border-none font-bold h-12"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Description</label>
                            <Textarea 
                              placeholder="Describe what you will provide in this session..." 
                              value={service.description}
                              onChange={(e) => updateService(index, 'description', e.target.value)}
                              className="rounded-xl bg-slate-50 border-none font-medium min-h-[100px]"
                            />
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Price (₹)</label>
                                <div className="relative">
                                   <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                   <Input 
                                     type="number"
                                     value={service.price}
                                     onChange={(e) => updateService(index, 'price', e.target.value)}
                                     className="rounded-xl bg-slate-50 border-none font-black h-12 pl-10"
                                   />
                                </div>
                             </div>
                             <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Duration (Min)</label>
                                <div className="relative">
                                   <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                   <Input 
                                     type="number"
                                     value={service.duration_minutes}
                                     onChange={(e) => updateService(index, 'duration_minutes', e.target.value)}
                                     className="rounded-xl bg-slate-50 border-none font-black h-12 pl-10"
                                   />
                                </div>
                             </div>
                          </div>
                          
                          <div className="pt-4 flex justify-end">
                             <Button 
                               variant="ghost" 
                               onClick={() => removeService(index)}
                               className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold px-6"
                             >
                               <Trash2 className="mr-2 h-4 w-4" /> Remove Service
                             </Button>
                          </div>
                       </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

        </div>
      </div>
    </AuthGuard>
  )
}
