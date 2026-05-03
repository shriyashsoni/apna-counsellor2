"use server"

import { resend } from "@/lib/resend"

const FROM_EMAIL = "onboarding@resend.dev"; // User should change this once they verify domain
const SITE_URL = "https://apnacounsellor.in";
const LOGO_URL = `${SITE_URL}/images/apna-counsellor-logo.png`;

/**
 * Premium HTML Email Wrapper
 */
const getBrandedLayout = (content: string, previewText: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apna Counsellor</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <div style="display: none; max-height: 0px; overflow: hidden;">${previewText}</div>
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(109, 40, 217, 0.05);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 0; background: linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%);">
              <img src="${LOGO_URL}" alt="Apna Counsellor" width="180" style="display: block; filter: brightness(0) invert(1);">
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 60px 50px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 40px 50px; background-color: #fafafa; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0 0 20px 0; font-size: 14px; font-weight: 800; color: #6d28d9; text-transform: uppercase; letter-spacing: 2px;">Follow Our Journey</p>
              <div style="margin-bottom: 30px;">
                <a href="https://instagram.com/apnacounsellor" style="text-decoration: none; margin: 0 10px;"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="24" height="24"></a>
                <a href="https://linkedin.com/company/apnacounsellor" style="text-decoration: none; margin: 0 10px;"><img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" width="24" height="24"></a>
                <a href="https://youtube.com/@apnacounsellor" style="text-decoration: none; margin: 0 10px;"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" width="24" height="24"></a>
              </div>
              <p style="margin: 0; font-size: 12px; color: #94a3b8; font-weight: 500;">
                &copy; 2025 Apna Counsellor. All rights reserved.<br/>
                India's #1 Admission Partner for JEE, NEET, MHT-CET & more.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export async function sendWelcomeEmail(to: string, name: string) {
  const content = `
    <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 900; color: #1e293b; tracking: -1px;">Welcome to the Family! 🚀</h2>
    <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 26px; color: #475569; font-weight: 500;">Hi ${name},</p>
    <p style="margin: 0 0 35px 0; font-size: 16px; line-height: 26px; color: #475569; font-weight: 500;">We're thrilled to have you join India's #1 Admission Partner. Your journey to your dream college starts today, and we're here to guide you every step of the way.</p>
    
    <div style="background-color: #f5f3ff; border-radius: 20px; padding: 30px; margin-bottom: 40px; border: 1px solid #ddd6fe;">
      <h3 style="margin: 0 0 15px 0; font-size: 14px; font-weight: 800; color: #6d28d9; text-transform: uppercase;">Next Steps for You</h3>
      <ul style="margin: 0; padding: 0; list-style: none;">
        <li style="margin-bottom: 12px; font-size: 15px; font-weight: 600; color: #5b21b6;">✨ Complete your student profile</li>
        <li style="margin-bottom: 12px; font-size: 15px; font-weight: 600; color: #5b21b6;">📊 Explore our 2025 College Predictors</li>
        <li style="margin-bottom: 0; font-size: 15px; font-weight: 600; color: #5b21b6;">🎓 Book a 1-on-1 session with our Experts</li>
      </ul>
    </div>

    <a href="${SITE_URL}/dashboard" style="display: inline-block; background-color: #6d28d9; color: #ffffff; font-weight: 800; font-size: 16px; padding: 20px 40px; text-decoration: none; border-radius: 16px; box-shadow: 0 10px 20px rgba(109, 40, 217, 0.2);">Go to Dashboard</a>
  `;
  
  return resend.emails.send({
    from: `Apna Counsellor <${FROM_EMAIL}>`,
    to: [to],
    subject: `Welcome to Apna Counsellor, ${name}!`,
    html: getBrandedLayout(content, `Welcome to India's #1 Admission Partner, ${name}!`)
  });
}

export async function sendBookingConfirmation(to: string, mentorName: string, date: string, time: string, link: string) {
  const content = `
    <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 900; color: #1e293b;">Session Confirmed! ✅</h2>
    <p style="margin: 0 0 35px 0; font-size: 16px; line-height: 26px; color: #475569; font-weight: 500;">Great news! Your consultancy call with <strong>${mentorName}</strong> is successfully scheduled. Our expert is excited to help you navigate your career path.</p>
    
    <div style="background-color: #f8fafc; border: 2px solid #f1f5f9; border-radius: 20px; padding: 30px; margin-bottom: 40px;">
      <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Booking Details</p>
      <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: 800; color: #1e293b;">📅 Date: ${date}</p>
      <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: 800; color: #1e293b;">⏰ Time: ${time}</p>
    </div>

    <div style="display: flex; gap: 15px; margin-bottom: 40px;">
      <a href="${link}" style="display: inline-block; background-color: #6d28d9; color: #ffffff; font-weight: 800; font-size: 14px; padding: 18px 30px; text-decoration: none; border-radius: 14px; margin-right: 10px;">Join Google Meet</a>
      <a href="https://wa.me/919340059530" style="display: inline-block; background-color: #25d366; color: #ffffff; font-weight: 800; font-size: 14px; padding: 18px 30px; text-decoration: none; border-radius: 14px;">Join via WhatsApp</a>
    </div>

    <p style="margin: 0; font-size: 14px; color: #94a3b8; font-weight: 600; font-style: italic;">Note: Please make sure to join 5 minutes early with a stable internet connection.</p>
  `;
  
  return resend.emails.send({
    from: `Apna Counsellor <${FROM_EMAIL}>`,
    to: [to],
    subject: `Booking Confirmed: ${mentorName} x Apna Counsellor`,
    html: getBrandedLayout(content, `Your session with ${mentorName} is confirmed for ${date}.`)
  });
}

export async function sendBroadCastEmail(to: string[], title: string, message: string, actionLink?: string) {
  const content = `
    <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 900; color: #1e293b;">${title}</h2>
    <div style="font-size: 16px; line-height: 28px; color: #475569; font-weight: 500; margin-bottom: 40px;">
      ${message.replace(/\n/g, '<br/>')}
    </div>
    ${actionLink ? `
      <a href="${actionLink}" style="display: inline-block; background-color: #6d28d9; color: #ffffff; font-weight: 800; font-size: 16px; padding: 20px 40px; text-decoration: none; border-radius: 16px; shadow: 0 10px 20px rgba(109, 40, 217, 0.2);">Take Action Now</a>
    ` : ''}
  `;

  return resend.emails.send({
    from: `Apna Counsellor <${FROM_EMAIL}>`,
    to: to,
    subject: `Update: ${title}`,
    html: getBrandedLayout(content, title)
  });
}

export async function sendAdminNotification(subject: string, message: string) {
  const ADMIN_EMAILS = ["sonishriyash@gmail.com", "apnacounsellor@gmail.com"];
  const content = `
    <h2 style="color: #ef4444; font-weight: 900;">Platform Alert</h2>
    <p style="font-size: 16px; font-weight: 500; color: #475569;">${message}</p>
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
      <p style="font-size: 12px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">System Log Output</p>
    </div>
  `;
  
  return resend.emails.send({
    from: `System Alert <${FROM_EMAIL}>`,
    to: ADMIN_EMAILS,
    subject: `[ADMIN] ${subject}`,
    html: getBrandedLayout(content, subject)
  });
}
