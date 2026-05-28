"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./tara-chat.css";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestedProducts?: SuggestedProduct[];
  handoff?: Handoff;
}

interface SuggestedProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  url: string;
}

interface Handoff {
  whatsapp: string;
  email: string;
  message: string;
}

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi, I'm Tara — your GetPanted stylist. I can suggest trousers, help with sizing, explain shipping, or guide you to made-to-order. What can I help you find today?",
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("tara-session-id");
  if (!id) {
    id = uid();
    sessionStorage.setItem("tara-session-id", id);
  }
  return id;
}

export function TaraChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHandoffForm, setShowHandoffForm] = useState(false);
  const [handoffName, setHandoffName] = useState("");
  const [handoffEmail, setHandoffEmail] = useState("");
  const [handoffMessage, setHandoffMessage] = useState("");
  const [handoffSending, setHandoffSending] = useState(false);
  const [handoffSent, setHandoffSent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  useEffect(() => {
    if (!open) return;
    // Avoid iOS Safari page zoom — only auto-focus on larger screens
    const canAutoFocus = window.matchMedia("(min-width: 769px)").matches;
    if (canAutoFocus) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prevOverflowX = document.body.style.overflowX;
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = prevOverflowX;
    };
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { id: uid(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const history = [...messages, userMsg]
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          messages: history.slice(0, -1),
          sessionId: getSessionId(),
          customerEmail: handoffEmail || undefined,
          customerName: handoffName || undefined,
        }),
      });

      const json = (await res.json()) as {
        message?: string;
        suggestedProducts?: SuggestedProduct[];
        handoff?: Handoff;
        error?: string;
      };

      if (!res.ok) throw new Error(json.error ?? "Request failed");

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: json.message ?? "I'm here to help — could you tell me more?",
          suggestedProducts: json.suggestedProducts,
          handoff: json.handoff,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please reach our team on WhatsApp or email hello@getpanted.com — they'll be happy to help.",
          handoff: {
            whatsapp: "https://wa.me/2348000000000",
            email: "hello@getpanted.com",
            message: "Connect with our team directly.",
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages, handoffEmail, handoffName]);

  const submitHandoff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handoffMessage.trim()) return;
    setHandoffSending(true);
    try {
      const res = await fetch("/api/tara-escalate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: handoffName,
          email: handoffEmail,
          message: handoffMessage,
          sessionId: getSessionId(),
          conversation: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (res.ok) setHandoffSent(true);
    } finally {
      setHandoffSending(false);
    }
  };

  if (process.env.NEXT_PUBLIC_TARA_ENABLED === "false") return null;

  return (
    <>
      {!open && (
        <button
          type="button"
          className="tara-launcher"
          onClick={() => setOpen(true)}
          aria-label="Chat with Tara"
        >
          <span className="tara-launcher-icon" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <span className="tara-launcher-label">Ask Tara</span>
        </button>
      )}

      {open && (
        <div className="tara-panel-shell" aria-hidden={false}>
          <div className="tara-panel" role="dialog" aria-label="Chat with Tara">
          <header className="tara-header">
            <div className="tara-header-info">
              <div className="tara-avatar">T</div>
              <div>
                <p className="tara-name">Tara</p>
                <p className="tara-status">GetPanted stylist · Online</p>
              </div>
            </div>
            <button type="button" className="tara-close" onClick={() => setOpen(false)} aria-label="Close chat">
              ×
            </button>
          </header>

          <div className="tara-messages" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`tara-bubble-wrap ${msg.role}`}>
                <div className={`tara-bubble ${msg.role}`}>
                  <p>{msg.content}</p>
                </div>
                {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                  <div className="tara-products">
                    {msg.suggestedProducts.map((p) => (
                      <Link key={p.id} href={`/products/${p.id}`} className="tara-product-card" onClick={() => setOpen(false)}>
                        <div className="tara-product-img">
                          <Image src={p.image} alt={p.name} fill className="object-cover" sizes="64px" />
                        </div>
                        <div>
                          <p className="tara-product-name">{p.name}</p>
                          <p className="tara-product-price">{p.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {msg.handoff && (
                  <div className="tara-handoff">
                    <p>{msg.handoff.message}</p>
                    <div className="tara-handoff-actions">
                      <a href={msg.handoff.whatsapp} target="_blank" rel="noreferrer" className="tara-handoff-btn primary">
                        WhatsApp
                      </a>
                      <a href={`mailto:${msg.handoff.email}`} className="tara-handoff-btn">
                        Email
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="tara-bubble-wrap assistant">
                <div className="tara-bubble assistant tara-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
          </div>

          <div className="tara-quick">
            {["Suggest wide-leg pants", "Help me choose a size", "Shipping info"].map((q) => (
              <button key={q} type="button" className="tara-quick-btn" onClick={() => sendMessage(q)} disabled={loading}>
                {q}
              </button>
            ))}
          </div>

          {showHandoffForm ? (
            <form className="tara-handoff-form" onSubmit={submitHandoff}>
              {handoffSent ? (
                <p className="tara-handoff-success">Sent — our team will follow up soon. You can also WhatsApp us directly.</p>
              ) : (
                <>
                  <p className="tara-handoff-form-title">Talk to the team</p>
                  <input type="text" placeholder="Your name (optional)" value={handoffName} onChange={(e) => setHandoffName(e.target.value)} className="tara-input" />
                  <input type="email" placeholder="Your email (optional)" value={handoffEmail} onChange={(e) => setHandoffEmail(e.target.value)} className="tara-input" />
                  <textarea placeholder="How can we help?" value={handoffMessage} onChange={(e) => setHandoffMessage(e.target.value)} className="tara-input tara-textarea" rows={3} required />
                  <div className="tara-handoff-form-actions">
                    <button type="button" className="tara-handoff-btn" onClick={() => setShowHandoffForm(false)}>Back</button>
                    <button type="submit" className="tara-handoff-btn primary" disabled={handoffSending}>
                      {handoffSending ? "Sending…" : "Send to team"}
                    </button>
                  </div>
                </>
              )}
            </form>
          ) : (
            <footer className="tara-footer">
              <textarea
                ref={inputRef}
                className="tara-input tara-textarea"
                placeholder="Ask Tara anything…"
                value={input}
                rows={1}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                disabled={loading}
              />
              <div className="tara-footer-actions">
                <button type="button" className="tara-human-btn" onClick={() => setShowHandoffForm(true)}>
                  Talk to human
                </button>
                <button type="button" className="tara-send-btn" onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
                  Send
                </button>
              </div>
            </footer>
          )}
          </div>
        </div>
      )}
    </>
  );
}
