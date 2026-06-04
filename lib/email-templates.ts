// ============================================================
// APNA COUNSELLOR — RESEND EMAIL TEMPLATES
// ============================================================

export function getEnrollmentWelcomeEmail({
  studentName,
  courseTitle,
  startDate,
  whatsappUrl,
}: {
  studentName: string
  courseTitle: string
  startDate?: string
  whatsappUrl?: string
  googleFormUrl?: string
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to ${courseTitle}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- HEADER BANNER -->
        <tr>
          <td style="background:linear-gradient(135deg,#7c3aed 0%,#9333ea 50%,#a855f7 100%);padding:40px 32px;text-align:center;">
            <p style="margin:0 0 8px 0;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.7);">APNA COUNSELLOR</p>
            <h1 style="margin:0;font-size:32px;font-weight:900;color:#ffffff;line-height:1.2;">🎉 You're In!</h1>
            <p style="margin:12px 0 0 0;font-size:16px;color:rgba(255,255,255,0.9);font-weight:500;">Enrollment Confirmed Successfully</p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:40px 32px;">
            <p style="margin:0 0 8px 0;font-size:14px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Hello,</p>
            <h2 style="margin:0 0 24px 0;font-size:26px;font-weight:900;color:#111827;">${studentName}! 👋</h2>

            <p style="margin:0 0 20px 0;font-size:16px;color:#374151;line-height:1.7;">
              Welcome aboard! Your enrollment for <strong style="color:#7c3aed;">${courseTitle}</strong> is now officially confirmed. We are thrilled to have you join the Apna Counsellor family!
            </p>

            <!-- Course Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#faf5ff,#f3e8ff);border:1.5px solid #e9d5ff;border-radius:16px;margin:0 0 28px 0;">
              <tr><td style="padding:24px;">
                <p style="margin:0 0 4px 0;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#9333ea;">YOUR COURSE</p>
                <h3 style="margin:0 0 12px 0;font-size:20px;font-weight:900;color:#4c1d95;">${courseTitle}</h3>
                ${startDate ? `<p style="margin:0;font-size:14px;color:#6b21a8;font-weight:600;">📅 Starts on: <strong>${startDate}</strong></p>` : ''}
              </td></tr>
            </table>

            <!-- Next Steps -->
            <h3 style="margin:0 0 16px 0;font-size:18px;font-weight:900;color:#111827;">Your Next Steps 👇</h3>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
              ${whatsappUrl ? `
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="width:36px;height:36px;background:#dcfce7;border-radius:50%;text-align:center;vertical-align:middle;font-size:18px;">💬</td>
                    <td style="padding-left:14px;">
                      <p style="margin:0;font-size:14px;font-weight:800;color:#111827;">Join the Official WhatsApp Group</p>
                      <p style="margin:4px 0 0 0;font-size:13px;color:#6b7280;">Get live updates, lecture links, and mentor support.</p>
                    </td>
                  </tr></table>
                </td>
              </tr>` : ''}
              ${googleFormUrl ? `
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="width:36px;height:36px;background:#fef08a;border-radius:50%;text-align:center;vertical-align:middle;font-size:18px;">📝</td>
                    <td style="padding-left:14px;">
                      <p style="margin:0;font-size:14px;font-weight:800;color:#111827;">Complete Your Profile Form</p>
                      <p style="margin:4px 0 0 0;font-size:13px;color:#6b7280;">Please fill out this required form so we can tailor the session for you.</p>
                    </td>
                  </tr></table>
                </td>
              </tr>` : ''}
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="width:36px;height:36px;background:#dbeafe;border-radius:50%;text-align:center;vertical-align:middle;font-size:18px;">📚</td>
                    <td style="padding-left:14px;">
                      <p style="margin:0;font-size:14px;font-weight:800;color:#111827;">Access Course Content</p>
                      <p style="margin:4px 0 0 0;font-size:13px;color:#6b7280;">Log into your dashboard to access all videos and resources.</p>
                    </td>
                  </tr></table>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="width:36px;height:36px;background:#fef3c7;border-radius:50%;text-align:center;vertical-align:middle;font-size:18px;">🎯</td>
                    <td style="padding-left:14px;">
                      <p style="margin:0;font-size:14px;font-weight:800;color:#111827;">Contact Your Mentor</p>
                      <p style="margin:4px 0 0 0;font-size:13px;color:#6b7280;">Have questions? Reach out anytime at apnacounsellor@gmail.com</p>
                    </td>
                  </tr></table>
                </td>
              </tr>
            </table>

            <!-- CTA BUTTONS -->
            ${whatsappUrl ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
              <tr>
                <td align="center">
                  <a href="${whatsappUrl}" style="display:inline-block;background:#25D366;color:#ffffff;font-size:15px;font-weight:900;text-decoration:none;padding:16px 36px;border-radius:50px;box-shadow:0 4px 15px rgba(37,211,102,0.35);">
                    💬 Join WhatsApp Group
                  </a>
                </td>
              </tr>
            </table>` : ''}
            ${googleFormUrl ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
              <tr>
                <td align="center">
                  <a href="${googleFormUrl}" style="display:inline-block;background:#3b82f6;color:#ffffff;font-size:15px;font-weight:900;text-decoration:none;padding:16px 36px;border-radius:50px;box-shadow:0 4px 15px rgba(59,130,246,0.35);">
                    📝 Fill Profile Data Form
                  </a>
                </td>
              </tr>
            </table>` : ''}

            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px 0;">
              <tr>
                <td align="center">
                  <a href="https://apnacounsellor.in/dashboard" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#9333ea);color:#ffffff;font-size:15px;font-weight:900;text-decoration:none;padding:16px 36px;border-radius:50px;box-shadow:0 4px 15px rgba(124,58,237,0.35);">
                    🚀 Go to My Dashboard
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:24px 32px;text-align:center;">
            <p style="margin:0 0 8px 0;font-size:14px;font-weight:800;color:#7c3aed;">Apna Counsellor</p>
            <p style="margin:0 0 8px 0;font-size:12px;color:#9ca3af;">India's Trusted Admission Counselling Platform</p>
            <p style="margin:0;font-size:12px;color:#d1d5db;">📧 apnacounsellor@gmail.com &nbsp;|&nbsp; 📞 +91 9109881906</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`
}

export function getContactQueryEmail({
  name,
  email,
  phone,
  subject,
  message,
  queryType,
}: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  queryType: string
}) {
  const badgeColor: Record<string, string> = {
    general: '#3b82f6',
    counselling: '#8b5cf6',
    course: '#f59e0b',
    technical: '#ef4444',
    other: '#6b7280',
  }
  const color = badgeColor[queryType] || '#6b7280'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Query — ${name}</title>
</head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1a1a1a;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">

        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 100%);padding:32px;text-align:center;border-bottom:2px solid ${color};">
            <p style="margin:0 0 6px 0;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.5);">APNA COUNSELLOR ADMIN</p>
            <h1 style="margin:0;font-size:24px;font-weight:900;color:#ffffff;">📨 New Contact Query</h1>
            <div style="margin:14px auto 0;display:inline-block;background:${color}20;border:1.5px solid ${color};border-radius:50px;padding:4px 16px;">
              <p style="margin:0;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${color};">${queryType.toUpperCase()}</p>
            </div>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:32px;">

            <!-- Sender Info -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#222222;border:1px solid rgba(255,255,255,0.08);border-radius:14px;margin:0 0 24px 0;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0 0 16px 0;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#6b7280;">SENDER DETAILS</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                      <span style="font-size:12px;font-weight:700;color:#9ca3af;width:80px;display:inline-block;">NAME</span>
                      <span style="font-size:14px;font-weight:800;color:#ffffff;">${name}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                      <span style="font-size:12px;font-weight:700;color:#9ca3af;width:80px;display:inline-block;">EMAIL</span>
                      <a href="mailto:${email}" style="font-size:14px;font-weight:800;color:#a78bfa;text-decoration:none;">${email}</a>
                    </td>
                  </tr>
                  ${phone ? `
                  <tr>
                    <td style="padding:8px 0;">
                      <span style="font-size:12px;font-weight:700;color:#9ca3af;width:80px;display:inline-block;">PHONE</span>
                      <a href="tel:${phone}" style="font-size:14px;font-weight:800;color:#a78bfa;text-decoration:none;">${phone}</a>
                    </td>
                  </tr>` : ''}
                </table>
              </td></tr>
            </table>

            <!-- Subject -->
            <p style="margin:0 0 8px 0;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#6b7280;">SUBJECT</p>
            <h2 style="margin:0 0 24px 0;font-size:20px;font-weight:900;color:#f9fafb;">${subject}</h2>

            <!-- Message -->
            <p style="margin:0 0 8px 0;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#6b7280;">MESSAGE</p>
            <div style="background:#222222;border:1px solid rgba(255,255,255,0.08);border-left:4px solid ${color};border-radius:12px;padding:20px 24px;margin:0 0 28px 0;">
              <p style="margin:0;font-size:15px;color:#e5e7eb;line-height:1.8;white-space:pre-wrap;">${message}</p>
            </div>

            <!-- Reply CTA -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#9333ea);color:#ffffff;font-size:14px;font-weight:900;text-decoration:none;padding:14px 32px;border-radius:50px;">
                    ↩ Reply to ${name}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="border-top:1px solid rgba(255,255,255,0.06);padding:20px 32px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#4b5563;">This message was sent via the Apna Counsellor Contact Form</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`
}

export function getContactAutoReplyEmail({ name, subject }: { name: string; subject: string }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>We received your query!</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#7c3aed 0%,#9333ea 100%);padding:40px 32px;text-align:center;">
            <h1 style="margin:0;font-size:30px;font-weight:900;color:#ffffff;">✅ Query Received!</h1>
            <p style="margin:12px 0 0 0;font-size:15px;color:rgba(255,255,255,0.85);">We'll get back to you within 24 hours</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 32px;">
            <p style="font-size:16px;color:#374151;line-height:1.7;margin:0 0 20px 0;">
              Hi <strong>${name}</strong>, thank you for reaching out to <strong style="color:#7c3aed;">Apna Counsellor</strong>! We have successfully received your query:
            </p>
            <div style="background:#faf5ff;border:1.5px solid #e9d5ff;border-radius:12px;padding:16px 20px;margin:0 0 28px 0;">
              <p style="margin:0;font-size:15px;font-weight:800;color:#4c1d95;">"${subject}"</p>
            </div>
            <p style="font-size:15px;color:#6b7280;line-height:1.7;margin:0 0 20px 0;">Our counselling team will review your query and reply to your email address within <strong>24 hours</strong> on working days. For urgent queries, you can also reach us via:</p>
            <table cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
              <tr>
                <td style="padding:6px 0;">
                  <a href="https://wa.link/cld3hu" style="font-size:14px;font-weight:800;color:#25D366;text-decoration:none;">💬 WhatsApp: wa.link/cld3hu</a>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0;">
                  <a href="tel:+919109881906" style="font-size:14px;font-weight:800;color:#7c3aed;text-decoration:none;">📞 Call: +91 9109881906</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:24px 32px;text-align:center;">
            <p style="margin:0;font-size:14px;font-weight:800;color:#7c3aed;">Apna Counsellor</p>
            <p style="margin:4px 0 0 0;font-size:12px;color:#9ca3af;">India's Trusted Admission Counselling Platform</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`
}
