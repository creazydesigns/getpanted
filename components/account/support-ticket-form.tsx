"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/app/context/auth-context";
import { SUPPORT_CATEGORIES, SUPPORT_TICKET_TYPES } from "@/lib/support/constants";

export function SupportTicketForm() {
  const { user, profile } = useAuth();
  const [subject, setSubject] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");

  const customerName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    (user?.user_metadata?.first_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Client";

  const customerEmail = user?.email ?? "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTicketNumber("");

    try {
      const res = await fetch("/api/account/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          ticket_type: ticketType,
          category,
          message,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not submit ticket");

      setTicketNumber(json.ticketNumber);
      setSubject("");
      setTicketType("");
      setCategory("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (ticketNumber) {
    return (
      <div className="account-support-success">
        <p className="account-support-success-eyebrow font-barlow-cond">Ticket received</p>
        <p className="account-support-success-number">{ticketNumber}</p>
        <p className="account-support-success-text font-barlow">
          Thank you. A confirmation email with your support ticket number has been sent to{" "}
          <strong>{customerEmail}</strong>. Our team will respond as soon as possible.
        </p>
        <button
          type="button"
          className="account-btn account-btn-outline"
          style={{ maxWidth: 280, marginTop: 8 }}
          onClick={() => setTicketNumber("")}
        >
          Submit another ticket
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="account-support-form">
      <div className="account-support-client">
        <div>
          <span className="account-support-client-label font-barlow-cond">Name</span>
          <p className="account-support-client-value">{customerName}</p>
        </div>
        <div>
          <span className="account-support-client-label font-barlow-cond">Email</span>
          <p className="account-support-client-value">{customerEmail}</p>
        </div>
      </div>

      <label className="account-label">
        <span>Subject</span>
        <input
          className="account-input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          maxLength={200}
          placeholder="Brief summary of your message"
        />
      </label>

      <label className="account-label">
        <span>Type</span>
        <select
          className="account-select"
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value)}
          required
        >
          <option value="" disabled>
            Select query or feedback
          </option>
          {SUPPORT_TICKET_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <label className="account-label">
        <span>Category</span>
        <select
          className="account-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>
            Choose a category
          </option>
          {SUPPORT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label className="account-label">
        <span>Message</span>
        <textarea
          className="account-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          placeholder="Tell us how we can help…"
        />
      </label>

      {error && <p className="account-message account-message--error">{error}</p>}

      <button type="submit" className="account-btn account-btn-primary" disabled={loading}>
        {loading ? "Submitting…" : "Submit Ticket"}
      </button>
    </form>
  );
}
