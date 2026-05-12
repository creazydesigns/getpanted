import * as React from "react";

interface BespokeConfirmationProps {
  customerName: string;
  customerEmail: string;
  orderId: string;
  selections: {
    silhouette: string;
    waistStyle: string;
    pleatStyle: string;
    fabric: string;
    color: string;
    timeline: string;
  };
  notes?: string;
}

export default function BespokeConfirmation({
  customerName,
  orderId,
  selections,
  notes,
}: BespokeConfirmationProps) {
  const firstName = customerName.split(" ")[0];

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Bespoke Order Received — GetPanted</title>
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

                {/* Body */}
                <tr>
                  <td style={{ padding: "40px 40px 24px" }}>
                    <p style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 700, color: "#1A1A1A" }}>
                      Your bespoke order is received.
                    </p>
                    <p style={{ margin: "0 0 32px", fontSize: "15px", color: "#6B6B6B", lineHeight: 1.6 }}>
                      Hi {firstName}, we&apos;ve received your custom order request. Our team will review your selections and reach out within 24 hours to confirm details and discuss next steps.
                    </p>

                    {/* Order reference */}
                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ background: "#F7F7F7", padding: "16px 20px", marginBottom: "32px" }}>
                      <tr>
                        <td style={{ fontSize: "12px", color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.1em" }}>Reference</td>
                        <td style={{ textAlign: "right", fontSize: "14px", fontWeight: 700, color: "#1A1A1A" }}>{orderId}</td>
                      </tr>
                    </table>

                    {/* Selections */}
                    <p style={{ margin: "0 0 12px", fontSize: "12px", fontWeight: 700, color: "#1A1A1A", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      Your Selections
                    </p>
                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderTop: "1px solid #E0E0E0", marginBottom: "32px" }}>
                      {Object.entries({
                        Silhouette:   selections.silhouette,
                        "Waist Style": selections.waistStyle,
                        "Pleat Style": selections.pleatStyle,
                        Fabric:        selections.fabric,
                        Colour:        selections.color,
                        Timeline:      selections.timeline,
                      }).map(([label, value]) => (
                        <tr key={label}>
                          <td style={{ padding: "10px 0", fontSize: "13px", color: "#6B6B6B", borderBottom: "1px solid #E0E0E0" }}>{label}</td>
                          <td style={{ padding: "10px 0", fontSize: "13px", fontWeight: 600, color: "#1A1A1A", textAlign: "right", borderBottom: "1px solid #E0E0E0" }}>{value}</td>
                        </tr>
                      ))}
                    </table>

                    {notes && (
                      <>
                        <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: 700, color: "#1A1A1A", textTransform: "uppercase", letterSpacing: "0.1em" }}>Notes</p>
                        <p style={{ margin: "0 0 32px", fontSize: "14px", color: "#6B6B6B", lineHeight: 1.6 }}>{notes}</p>
                      </>
                    )}

                    {/* Contact info */}
                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ background: "#F7F7F7", padding: "16px 20px", marginBottom: "40px" }}>
                      <tr>
                        <td style={{ fontSize: "14px", color: "#6B6B6B", lineHeight: 1.6 }}>
                          Have questions?{" "}
                          <a href="mailto:bespoke@getpanted.com" style={{ color: "#5C2D8F", textDecoration: "none", fontWeight: 600 }}>
                            bespoke@getpanted.com
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ background: "#1A1A1A", padding: "24px 40px", textAlign: "center" }}>
                    <p style={{ margin: 0, fontSize: "11px", color: "#444" }}>© 2026 GetPanted. All rights reserved.</p>
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
