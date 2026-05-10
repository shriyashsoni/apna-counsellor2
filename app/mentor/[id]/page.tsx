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

  try {
    const { data: mentor } = await supabase
      .from('profiles')
      .select('*')
      .or(`id.eq.${isUuid ? params.id : '00000000-0000-0000-0000-000000000000'},slug.eq.${params.id}`)
      .maybeSingle()

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
  } catch (e) {
    return {
      title: 'Mentor Profile | Apna Counsellor',
      description: 'Connect with expert mentors for college admission guidance.'
    }
  }
}

export default async function MentorProfilePage({ params }: MentorPageProps) {
  const supabase = createClient()
  
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id)

  const { data: mentor } = await supabase
    .from('profiles')
    .select('*')
    .or(`id.eq.${isUuid ? params.id : '00000000-0000-0000-0000-000000000000'},slug.eq.${params.id}`)
    .maybeSingle()

  if (!mentor) notFound()

  let sessions = []
  let reviews = []
  let services = []

  try {
    const { data: sessionsData } = await supabase
      .from('sessions')
      .select('*')
      .eq('mentor_id', mentor.id)
      .eq('status', 'available')
    sessions = sessionsData || []

    // Filter sessions by Google Calendar availability if linked
    if (mentor.google_refresh_token && sessions.length > 0) {
      try {
        sessions = await filterSessionsByAvailability(mentor.google_refresh_token, sessions)
      } catch (e) {
        console.error("Calendar filter failed:", e)
      }
    }

    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*')
      .eq('mentor_id', mentor.id)
      .order('created_at', { ascending: false })
    reviews = reviewsData || []

    const { data: servicesData } = await supabase
      .from('mentor_services')
      .select('*')
      .eq('mentor_id', mentor.id)
      .eq('is_active', true)
    services = servicesData || []
  } catch (err) {
    console.error("Data fetch error on mentor profile:", err)
  }

  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user
  let dbUser = null
  if (user) {
    try {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      dbUser = profile ? { ...user, ...profile } : user
    } catch (e) {
      dbUser = user
    }
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
