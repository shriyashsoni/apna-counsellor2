import { Metadata } from 'next';
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import MentorProfileClient from "./mentor-profile-client"
import { filterSessionsByAvailability } from "@/lib/google-calendar"

interface MentorPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: MentorPageProps): Promise<Metadata | undefined> {
  const supabase = createClient()
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id)

  const { data: mentor } = await supabase
    .from('profiles')
    .select('*')
    .or(`id.eq.${isUuid ? params.id : '00000000-0000-0000-0000-000000000000'},slug.eq.${params.id}`)
    .single()

  if (!mentor) return;

  const title = `${mentor.name} | Expert Mentor from ${mentor.college}`;
  const description = `Book a 1-on-1 session with ${mentor.name}. Expert guidance in ${mentor.branch} from ${mentor.college}. Solve your admission and career doubts today.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: mentor.image ? [mentor.image] : ['/images/mentor-preview-v1.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: mentor.image ? [mentor.image] : ['/images/mentor-preview-v1.png'],
    }
  };
}

export default async function MentorProfilePage({ params }: MentorPageProps) {
  const supabase = createClient()
  
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id)

  const { data: mentor } = await supabase
    .from('profiles')
    .select('*')
    .or(`id.eq.${isUuid ? params.id : '00000000-0000-0000-0000-000000000000'},slug.eq.${params.id}`)
    .single()

  if (!mentor) notFound()

  const { data: sessionsData } = await supabase
    .from('sessions')
    .select('*')
    .eq('mentor_id', mentor.id)
    .eq('status', 'available')

  let sessions = sessionsData || []

  // Filter sessions by Google Calendar availability if linked
  if (mentor.google_refresh_token && sessions.length > 0) {
    sessions = await filterSessionsByAvailability(mentor.google_refresh_token, sessions)
  }

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('mentor_id', mentor.id)
    .order('created_at', { ascending: false })

  const { data: services } = await supabase
    .from('mentor_services')
    .select('*')
    .eq('mentor_id', mentor.id)
    .eq('is_active', true)

  const { data: { user } } = await supabase.auth.getUser()
  let dbUser = null
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    dbUser = profile ? { ...user, ...profile } : user
  }

  return (
    <MentorProfileClient 
      initialMentor={mentor} 
      initialSessions={sessions || []} 
      initialReviews={reviews || []}
      initialServices={services || []}
      currentUser={dbUser} 
    />
  )
}
