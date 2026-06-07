import * as React from "react";

interface SupportTicketAckProps {
  firstName: string;
  ticketNumber: string;
  subject: string;
  ticketType: string;
  category: string;
  message: string;
}

export default function SupportTicketAck({
  firstName,
  ticketNumber,
  subject,
  ticketType,
  category,
  message,
}: SupportTicketAckProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getpanted.com";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Support Ticket Received — GetPanted</title>
      </head>
      <body style={{ margin: 0, padding: 0, background: "#F7F7F7", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ background: "#F7F7F7", padding: "40px 0" }}>
          <tr>
            <td align="center">
              <table width="600" cellPadding={0} cellSpacing={0} style={{ maxWidth: "600px", background: "#FFFFFF" }}>
                <tr>
                  <td style={{ background: "#1A1A1A", padding: "32px 40px", textAlign: "center" }}>
                    <p style={{ margin: 0, color: "#FFFFFF", fontSize: "22px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                      Get<span style={{ color: "#5C2D8F" }}>Panted</span>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "40px 40px 24px" }}>
                    <p style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 700, color: "#1A1A1A" }}>
                      We&apos;ve received your {ticketType.toLowerCase()}.
                    </p>
                    <p style={{ margin: "0 0 28px", fontSize: "15px", color: "#6B6B6B", lineHeight: 1.6 }}>
                      Hi {firstName}, thank you for reaching out. Our team has your message and will respond as soon as possible.
                    </p>

                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ background: "#EDE6F5", marginBottom: "28px" }}>
                      <tr>
                        <td style={{ padding: "24px 28px", textAlign: "center" }}>
                          <p style={{ margin: "0 0 6px", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#5C2D8F", fontWeight: 700 }}>
                            Support Ticket Number
                          </p>
                          <p style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: "#1A1A1A", letterSpacing: "0.06em" }}>
                            {ticketNumber}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#6B6B6B" }}>
                      <strong style={{ color: "#1A1A1A" }}>Subject:</strong> {subject}
                    </p>
                    <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#6B6B6B" }}>
                      <strong style={{ color: "#1A1A1A" }}>Category:</strong> {category}
                    </p>
                    <p style={{ margin: "0 0 24px", fontSize: "13px", color: "#6B6B6B", lineHeight: 1.7 }}>
                      <strong style={{ color: "#1A1A1A" }}>Your message:</strong>
                      <br />
                      {message}
                    </p>

                    <p style={{ margin: 0, fontSize: "14px", color: "#6B6B6B", lineHeight: 1.7 }}>
                      Please keep your ticket number for reference. You can reply to this email or visit your{" "}
                      <a href={`${siteUrl}/account/support`} style={{ color: "#5C2D8F" }}>client area</a> for more support options.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "24px 40px 40px", borderTop: "1px solid #F0F0F0" }}>
                    <p style={{ margin: 0, fontSize: "12px", color: "#9B9B9B", textAlign: "center" }}>
                      GetPanted · Lagos, Nigeria
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
