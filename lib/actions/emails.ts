"use server"

import { resend } from "@/lib/resend"

const FROM_EMAIL = "onboarding@resend.dev"; // User should change this once they verify domain

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Apna Counsellor <${FROM_EMAIL}>`,
      to: [to],
      subject: `Welcome to Apna Counsellor, ${name}!`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #6d28d9;">Welcome to the Family! 🚀</h1>
          <p>Hi ${name},</p>
          <p>We're thrilled to have you join India's #1 Admission Partner. Your journey to the best college starts here.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 10px; margin: 20px 0;">
            <strong>Next Steps:</strong>
            <ul>
              <li>Complete your profile</li>
              <li>Explore College Predictors</li>
              <li>Book a 1-on-1 session with our Experts</li>
            </ul>
          </div>
          <p>If you have any questions, just reply to this email.</p>
          <p>Best,<br/>Team Apna Counsellor</p>
        </div>
      `,
    });
    if (error) throw error;
    return { success: true, data };
  } catch (e) {
    console.error("Email Error:", e);
    return { success: false, error: e };
  }
}

export async function sendBookingConfirmation(to: string, mentorName: string, date: string, time: string, link: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Apna Counsellor <${FROM_EMAIL}>`,
      to: [to],
      subject: `Booking Confirmed: Session with ${mentorName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #059669;">Session Confirmed! ✅</h1>
          <p>Your consultancy call with <strong>${mentorName}</strong> has been successfully booked.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 10px; margin: 20px 0;">
            <p><strong>📅 Date:</strong> ${date}</p>
            <p><strong>⏰ Time:</strong> ${time}</p>
            <p><strong>🔗 Meeting Link:</strong> <a href="${link}">${link}</a></p>
          </div>
          <p>Please make sure to join 5 minutes early.</p>
          <p>Best,<br/>Team Apna Counsellor</p>
        </div>
      `,
    });
    if (error) throw error;
    return { success: true, data };
  } catch (e) {
    console.error("Email Error:", e);
    return { success: false, error: e };
  }
}

export async function sendAdminNotification(subject: string, message: string) {
  const ADMIN_EMAILS = ["sonishriyash@gmail.com", "apnacounsellor@gmail.com"];
  try {
    const { data, error } = await resend.emails.send({
      from: `System Alert <${FROM_EMAIL}>`,
      to: ADMIN_EMAILS,
      subject: `[ADMIN ALERT] ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #ef4444;">Platform Alert</h2>
          <p>${message}</p>
          <hr/>
          <p style="font-size: 10px; color: #999;">Automated notification from Admin Command Center.</p>
        </div>
      `,
    });
    if (error) throw error;
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e };
  }
}
