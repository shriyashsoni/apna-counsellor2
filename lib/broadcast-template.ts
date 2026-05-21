// Broadcast email HTML template generator
export function getBroadcastEmail({
  subject,
  body,
  ctaText,
  ctaUrl,
  accentColor = '#7c3aed',
}: {
  subject: string
  body: string
  ctaText?: string
  ctaUrl?: string
  accentColor?: string
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,${accentColor} 0%,${accentColor}cc 100%);padding:36px 32px;text-align:center;">
            <p style="margin:0 0 6px 0;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.7);">APNA COUNSELLOR</p>
            <h1 style="margin:0;font-size:26px;font-weight:900;color:#ffffff;line-height:1.3;">${subject}</h1>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:40px 32px;">
            <div style="font-size:15px;color:#374151;line-height:1.8;">
              ${body}
            </div>

            ${ctaText && ctaUrl ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0 0 0;">
              <tr>
                <td align="center">
                  <a href="${ctaUrl}" style="display:inline-block;background:${accentColor};color:#ffffff;font-size:15px;font-weight:900;text-decoration:none;padding:16px 40px;border-radius:50px;box-shadow:0 4px 15px ${accentColor}55;">
                    ${ctaText} →
                  </a>
                </td>
              </tr>
            </table>` : ''}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:24px 32px;text-align:center;">
            <p style="margin:0 0 4px 0;font-size:14px;font-weight:800;color:${accentColor};">Apna Counsellor</p>
            <p style="margin:0 0 4px 0;font-size:12px;color:#9ca3af;">India's Trusted Admission Counselling Platform</p>
            <p style="margin:0;font-size:11px;color:#d1d5db;">📧 apnacounsellor@gmail.com &nbsp;|&nbsp; 📞 +91 9109881906</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`
}
