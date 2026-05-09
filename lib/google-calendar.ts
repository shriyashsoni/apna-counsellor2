import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/google/callback`
);

export const getGoogleAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.readonly'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
};

export const getGoogleTokens = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

export const createMeetEvent = async (
  refreshToken: string,
  eventDetails: {
    summary: string;
    description: string;
    startTime: string;
    endTime: string;
    attendeeEmail: string;
  }
) => {
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = {
    summary: eventDetails.summary,
    description: eventDetails.description,
    start: {
      dateTime: eventDetails.startTime,
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: eventDetails.endTime,
      timeZone: 'Asia/Kolkata',
    },
    attendees: [{ email: eventDetails.attendeeEmail }],
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(7),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
    conferenceDataVersion: 1,
  });

  return response.data;
};

export const getBusySlots = async (
  refreshToken: string,
  timeMin: string,
  timeMax: string
) => {
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      items: [{ id: 'primary' }],
    },
  });

  return response.data.calendars?.primary?.busy || [];
};

export const filterSessionsByAvailability = async (
  refreshToken: string,
  sessions: any[]
) => {
  if (!sessions.length) return [];

  // Get date range for freebusy query
  // Assuming session.date is YYYY-MM-DD and time_slot contains HH:MM
  const dates = sessions.map(s => {
    const timePart = s.time_slot.split(' - ')[0] || s.time_slot.split(' ')[0] || '10:00';
    return new Date(`${s.date}T${timePart}:00`);
  });
  
  const timeMin = new Date(Math.min(...dates.map(d => d.getTime()))).toISOString();
  const timeMax = new Date(Math.max(...dates.map(d => d.getTime())) + 3600000).toISOString(); // +1 hour

  try {
    const busySlots = await getBusySlots(refreshToken, timeMin, timeMax);

    return sessions.filter(session => {
      const timePart = session.time_slot.split(' - ')[0] || session.time_slot.split(' ')[0] || '10:00';
      const sessionStart = new Date(`${session.date}T${timePart}:00`);
      const sessionEnd = new Date(sessionStart.getTime() + 45 * 60000); // 45 mins

      const isOverlap = busySlots.some(busy => {
        const busyStart = new Date(busy.start!);
        const busyEnd = new Date(busy.end!);
        return sessionStart < busyEnd && sessionEnd > busyStart;
      });

      return !isOverlap;
    });
  } catch (err) {
    console.error("Error filtering sessions:", err);
    return sessions; // Fallback to showing all if error
  }
};
