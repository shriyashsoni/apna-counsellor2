import { Metadata } from 'next';
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import MentorProfileClient from "./mentor-profile-client"

interface MentorPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: MentorPageProps): Promise<Metadata | undefined> {
  const supabase = createClient()
  const { data: mentor } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!mentor) return;

  const title = `${mentor.name} | Expert Mentor from ${mentor.college} | Apna Counsellor`;
  const description = `Book a personalized mentorship session with ${mentor.name}. Expert in ${mentor.branch} from ${mentor.college}. Get guidance on admissions, cutoffs, and career strategy.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: mentor.image ? [mentor.image] : ['https://apnacounsellor.in/images/real-mentor-preview.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: mentor.image ? [mentor.image] : ['https://apnacounsellor.in/images/real-mentor-preview.png'],
    }
  };
}

export default async function MentorProfilePage({ params }: MentorPageProps) {
  const supabase = createClient()
  
  const { data: mentor } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!mentor) notFound()

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('mentor_id', params.id)
    .eq('status', 'available')

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
      currentUser={dbUser} 
    />
  )
}
