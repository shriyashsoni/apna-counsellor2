import { Novu } from '@novu/node';

if (!process.env.NOVU_API_KEY) {
  console.warn('[novu] NOVU_API_KEY is not set — email/notification triggers will fail silently.');
}

export const novu = new Novu(process.env.NOVU_API_KEY || 'missing-key');

