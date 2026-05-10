'use client';

import { Inbox } from '@novu/nextjs';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from 'next-themes';

export default function NotificationInbox() {
  const { user } = useAuth();
  const { theme } = useTheme();

  const applicationIdentifier = process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER || 'hQtGANDBf4Q8';

  if (!user) return null;

  return (
    <Inbox
      applicationIdentifier={applicationIdentifier}
      subscriberId={user.id}
      backendUrl={process.env.NEXT_PUBLIC_NOVU_BACKEND_URL}
      socketUrl={process.env.NEXT_PUBLIC_NOVU_SOCKET_URL}
      appearance={{
        baseTheme: (theme === 'dark' ? 'dark' : 'light') as 'dark' | 'light',
        variables: {
          colorPrimary: 'hsl(270 70% 40%)',
          colorPrimaryForeground: 'white',
          colorSecondary: 'hsl(240 4.8% 95.9%)',
          colorSecondaryForeground: 'hsl(240 5.9% 10%)',
          colorCounter: '',
          colorCounterForeground: '',
          colorBackground: theme === 'dark' ? 'hsl(240 10% 3.9%)' : 'white',
          colorRing: '',
          colorForeground: theme === 'dark' ? 'white' : 'hsl(240 10% 3.9%)',
          colorNeutral: theme === 'dark' ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 5.9% 90%)',
          colorShadow: '',
          fontSize: '14px',
        },
        elements: {
          bellIcon: {
            color: '',
          },
        },
      }}
    />
  );
}
