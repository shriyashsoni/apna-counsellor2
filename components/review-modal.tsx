"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export function ReviewModal({ 
  isOpen, 
  onClose, 
  mentorId, 
  mentorName,
  sessionId 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  mentorId: string, 
  mentorName: string,
  sessionId: string
}) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from('reviews').insert({
        mentor_id: mentorId,
        reviewer_id: user.id,
        reviewer_name: user.user_metadata?.full_name || user.email,
        rating,
        comment,
      })

      if (error) throw error

      // Update session to marked as reviewed
      await supabase.from('sessions').update({ status: 'completed' }).eq('id', sessionId)

      toast.success("Review submitted! Thank you.")
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Review {mentorName}</DialogTitle>
          <DialogDescription className="font-medium">
            How was your session? Your feedback helps other students.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button 
                key={s} 
                onClick={() => setRating(s)}
                className="transition-transform hover:scale-110"
              >
                <Star className={`h-10 w-10 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="rounded-2xl border-slate-100 min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full h-14 rounded-2xl font-black bg-primary shadow-xl shadow-primary/20"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
