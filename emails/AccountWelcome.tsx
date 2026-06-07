import * as React from "react";

interface AccountWelcomeProps {
  firstName: string;
}

export default function AccountWelcome({ firstName }: AccountWelcomeProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getpanted.com";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Welcome to GetPanted</title>
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
                  <td style={{ padding: "40px 40px 32px" }}>
                    <p style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 700, color: "#1A1A1A" }}>
                      Welcome to your client area.
                    </p>
                    <p style={{ margin: "0 0 24px", fontSize: "15px", color: "#6B6B6B", lineHeight: 1.7 }}>
                      Hi {firstName}, your GetPanted account is ready. You can now track orders, save your wishlist, and reach our team anytime from your private client space.
                    </p>

                    <table cellPadding={0} cellSpacing={0} style={{ margin: "0 0 32px" }}>
                      <tr>
                        <td style={{ background: "#5C2D8F", padding: "14px 32px" }}>
                          <a href={`${siteUrl}/account`} style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: 700, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                            Go to My Account
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style={{ margin: 0, fontSize: "14px", color: "#6B6B6B", lineHeight: 1.7 }}>
                      Questions? Visit{" "}
                      <a href={`${siteUrl}/account/support`} style={{ color: "#5C2D8F" }}>
                        Feedback &amp; Queries
                      </a>{" "}
                      in your client area or reply to this email.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "24px 40px", borderTop: "1px solid #F0F0F0" }}>
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
