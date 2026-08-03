import Image from "next/image";
import { Suspense } from "react";
import { AdminLoginForm } from "./login-form";
import "../admin.css";

function AdminLoginBrand() {
  return (
    <div className="admin-login-brand">
      <Image
        src="/images/gp_favicon.svg"
        alt="GetPanted"
        width={72}
        height={72}
        className="admin-login-logo"
        priority
      />
      <p className="admin-login-wordmark font-playfair" style={{ margin: 0 }}>
        <span className="admin-login-wordmark-dark">Get</span>
        <span className="admin-login-wordmark-accent">Panted</span>
      </p>
      <span className="admin-login-brand-tag">Admin Dashboard</span>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="admin-root admin-login-page">
      <AdminLoginBrand />
      <Suspense fallback={<div className="admin-login-card">Loading…</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
