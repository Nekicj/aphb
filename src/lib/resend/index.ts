import { Resend } from 'resend';
import { env } from '~/t3-env';

export const resend = new Resend(env.RESEND_API_KEY);