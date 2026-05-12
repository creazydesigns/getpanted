import * as React from "react";

interface NewsletterWelcomeProps {
  firstName?: string;
  unsubscribeUrl?: string;
}

export default function NewsletterWelcome({
  firstName,
  unsubscribeUrl = "#",
}: NewsletterWelcomeProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getpanted.com";
  const greeting = firstName ? `Hi ${firstName},` : "Hello,";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Welcome to the Clan — GetPanted</title>
      </head>
      <body style={{ margin: 0, padding: 0, background: "#F7F7F7", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ background: "#F7F7F7", padding: "40px 0" }}>
          <tr>
            <td align="center">
              <table width="600" cellPadding={0} cellSpacing={0} style={{ maxWidth: "600px", background: "#FFFFFF" }}>
                {/* Header */}
                <tr>
                  <td style={{ background: "#1A1A1A", padding: "32px 40px", textAlign: "center" }}>
                    <p style={{ margin: 0, color: "#FFFFFF", fontSize: "22px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                      Get<span style={{ color: "#5C2D8F" }}>Panted</span>
                    </p>
                  </td>
                </tr>

                {/* Hero text */}
                <tr>
                  <td style={{ padding: "48px 40px 32px", textAlign: "center" }}>
                    <p style={{ margin: "0 0 12px", fontSize: "28px", fontWeight: 700, color: "#1A1A1A", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Welcome to the Clan.
                    </p>
                    <p style={{ margin: "0 0 24px", fontSize: "15px", color: "#6B6B6B", lineHeight: 1.7 }}>
                      {greeting}
                    </p>
                    <p style={{ margin: "0 0 36px", fontSize: "15px", color: "#6B6B6B", lineHeight: 1.7 }}>
                      You&apos;re now part of an exclusive circle that gets early access to new drops, behind-the-scenes stories, and members-only offers. We dress power — and now, that includes you.
                    </p>

                    {/* CTA */}
                    <table cellPadding={0} cellSpacing={0} style={{ margin: "0 auto 48px" }}>
                      <tr>
                        <td style={{ background: "#5C2D8F", padding: "14px 40px" }}>
                          <a href={`${siteUrl}/collections`} style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: 700, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                            Shop Now
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ background: "#1A1A1A", padding: "24px 40px", textAlign: "center" }}>
                    <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#6B6B6B" }}>
                      Questions? <a href="mailto:hello@getpanted.com" style={{ color: "#5C2D8F" }}>hello@getpanted.com</a>
                    </p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#444" }}>
                      <a href={unsubscribeUrl} style={{ color: "#555", textDecoration: "underline" }}>Unsubscribe</a>
                      {" · "}© 2026 GetPanted.
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
