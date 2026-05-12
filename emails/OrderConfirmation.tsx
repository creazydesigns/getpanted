import * as React from "react";

interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  price: string;
}

interface OrderConfirmationProps {
  firstName: string;
  orderId: string;
  items: OrderItem[];
  totalAmount: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  estimatedDelivery?: string;
}

export default function OrderConfirmation({
  firstName,
  orderId,
  items,
  totalAmount,
  shippingAddress,
  estimatedDelivery = "5–7 business days",
}: OrderConfirmationProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getpanted.com";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Order Confirmed — GetPanted</title>
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
                      Your order is confirmed.
                    </p>
                    <p style={{ margin: "0 0 32px", fontSize: "15px", color: "#6B6B6B", lineHeight: 1.6 }}>
                      Hi {firstName}, thank you for shopping with GetPanted. We&apos;ve received your order and are getting it ready.
                    </p>

                    {/* Order ID */}
                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ background: "#F7F7F7", padding: "16px 20px", marginBottom: "32px" }}>
                      <tr>
                        <td style={{ fontSize: "12px", color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.1em" }}>Order ID</td>
                        <td style={{ textAlign: "right", fontSize: "14px", fontWeight: 700, color: "#1A1A1A" }}>{orderId}</td>
                      </tr>
                    </table>

                    {/* Items */}
                    <p style={{ margin: "0 0 12px", fontSize: "12px", fontWeight: 700, color: "#1A1A1A", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      Items Ordered
                    </p>
                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderTop: "1px solid #E0E0E0", marginBottom: "24px" }}>
                      {items.map((item, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #E0E0E0" }}>
                          <td style={{ padding: "12px 0", fontSize: "14px", color: "#1A1A1A" }}>
                            {item.name}
                            <br />
                            <span style={{ fontSize: "12px", color: "#6B6B6B" }}>Size: {item.size} · Qty: {item.quantity}</span>
                          </td>
                          <td style={{ padding: "12px 0", textAlign: "right", fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>
                            {item.price}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td style={{ padding: "16px 0 0", fontSize: "14px", fontWeight: 700, color: "#1A1A1A" }}>Total</td>
                        <td style={{ padding: "16px 0 0", textAlign: "right", fontSize: "16px", fontWeight: 700, color: "#5C2D8F" }}>{totalAmount}</td>
                      </tr>
                    </table>

                    {/* Shipping Address */}
                    <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: 700, color: "#1A1A1A", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      Shipping To
                    </p>
                    <p style={{ margin: "0 0 32px", fontSize: "14px", color: "#6B6B6B", lineHeight: 1.7 }}>
                      {shippingAddress.street}<br />
                      {shippingAddress.city}, {shippingAddress.state}<br />
                      {shippingAddress.country}
                    </p>

                    {/* Delivery estimate */}
                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ background: "#F7F7F7", padding: "16px 20px", marginBottom: "32px" }}>
                      <tr>
                        <td style={{ fontSize: "12px", color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.1em" }}>Estimated Delivery</td>
                        <td style={{ textAlign: "right", fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>{estimatedDelivery}</td>
                      </tr>
                    </table>

                    {/* CTA */}
                    <table cellPadding={0} cellSpacing={0} style={{ marginBottom: "40px" }}>
                      <tr>
                        <td style={{ background: "#5C2D8F", padding: "14px 32px" }}>
                          <a href={`${siteUrl}/collections`} style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: 700, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                            Continue Shopping
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
