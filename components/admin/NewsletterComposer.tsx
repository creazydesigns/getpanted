"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RecipientField } from "./recipient-field";
import { EmailChipInput } from "./email-chip-input";
import { NewsletterEditor } from "./newsletter-editor";
import {
  type RecipientList,
  recipientSummary,
  resolveRecipients,
} from "@/lib/newsletter/recipient-lists";
import "./newsletter-composer.css";

const DRAFT_KEY = "getpanted-newsletter-draft";

export type NewsletterAttachment = {
  filename: string;
  content: string;
};

export type NewsletterSendPayload = {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  html?: string;
  attachments: NewsletterAttachment[];
  scheduledAt: string | null;
};

type DraftData = {
  selectedListIds: string[];
  manualTo: string[];
  to?: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  html: string;
  plainBody: string;
  plainTextMode: boolean;
  scheduledAt: string | null;
  attachments: { filename: string; dataUrl: string }[];
};

type NewsletterComposerProps = {
  open: boolean;
  onClose: () => void;
  recipientLists: RecipientList[];
  sending?: boolean;
  onSend: (payload: NewsletterSendPayload) => Promise<void>;
};

function stripHtml(html: string): string {
  if (typeof document === "undefined") return html.replace(/<[^>]+>/g, "");
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent ?? "";
}

function wrapEmailHtml(inner: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond&family=DM+Sans&display=swap" rel="stylesheet"/></head><body style="margin:0;padding:0;background:#ffffff;font-family:'DM Sans',Arial,sans-serif;color:#1a1a1a;"><div style="max-width:640px;margin:0 auto;padding:24px;">${inner}</div></body></html>`;
}

export function NewsletterComposer({
  open,
  onClose,
  recipientLists,
  sending = false,
  onSend,
}: NewsletterComposerProps) {
  const [selectedListIds, setSelectedListIds] = useState<string[]>([]);
  const [manualTo, setManualTo] = useState<string[]>([]);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("<p></p>");
  const [plainBody, setPlainBody] = useState("");
  const [plainTextMode, setPlainTextMode] = useState(false);
  const [attachments, setAttachments] = useState<{ filename: string; dataUrl: string }[]>([]);
  const [scheduledAt, setScheduledAt] = useState<string | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(
    null
  );
  const windowRef = useRef<HTMLDivElement>(null);
  const attachRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  const loadDraft = useCallback((): DraftData | null => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as DraftData;
    } catch {
      return null;
    }
  }, []);

  const saveDraft = useCallback(() => {
    const draft: DraftData = {
      selectedListIds,
      manualTo,
      cc,
      bcc,
      subject,
      html,
      plainBody,
      plainTextMode,
      scheduledAt,
      attachments,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [selectedListIds, manualTo, cc, bcc, subject, html, plainBody, plainTextMode, scheduledAt, attachments]);

  const resolvedCount = recipientSummary(selectedListIds, manualTo, recipientLists);

  useEffect(() => {
    if (!open || initializedRef.current) return;
    initializedRef.current = true;
    const draft = loadDraft();
    if (draft) {
      setSelectedListIds(draft.selectedListIds ?? []);
      setManualTo(draft.manualTo ?? draft.to ?? []);
      setCc(draft.cc);
      setBcc(draft.bcc);
      setSubject(draft.subject);
      setHtml(draft.html || "<p></p>");
      setPlainBody(draft.plainBody);
      setPlainTextMode(draft.plainTextMode);
      setScheduledAt(draft.scheduledAt);
      setAttachments(draft.attachments ?? []);
      if (draft.cc.length) setShowCc(true);
      if (draft.bcc.length) setShowBcc(true);
    }
  }, [open, loadDraft]);

  useEffect(() => {
    if (!open) {
      initializedRef.current = false;
      setMinimized(false);
      setExpanded(false);
      setPosition({ x: 0, y: 0 });
      setSelectedListIds([]);
      setManualTo([]);
    }
  }, [open]);

  const onTitleMouseDown = (e: React.MouseEvent) => {
    if (minimized || expanded) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
    };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      setPosition({
        x: dragRef.current.originX + (e.clientX - dragRef.current.startX),
        y: dragRef.current.originY + (e.clientY - dragRef.current.startY),
      });
    };
    const onUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const uploadImage = async (file: File): Promise<string | null> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return null;
    return (json as { url?: string }).url ?? null;
  };

  const onAttachFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const next = [...attachments];
    for (const file of Array.from(files)) {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      next.push({ filename: file.name, dataUrl });
    }
    setAttachments(next);
  };

  const discard = () => {
    if (!confirm("Discard this message?")) return;
    localStorage.removeItem(DRAFT_KEY);
    onClose();
  };

  const handleSend = async () => {
    const to = resolveRecipients(selectedListIds, manualTo, recipientLists);
    if (!to.length || !subject.trim()) return;

    if (scheduledAt && new Date(scheduledAt) > new Date()) {
      saveDraft();
      alert(
        `Broadcast saved as draft. Scheduled for ${new Date(scheduledAt).toLocaleString()}. Open the composer at that time and send, or clear the schedule to send now.`
      );
      return;
    }

    const body = plainTextMode ? plainBody.trim() : stripHtml(html).trim();
    const htmlBody = plainTextMode ? undefined : wrapEmailHtml(html);

    if (!body && !htmlBody) return;

    const attachmentPayload: NewsletterAttachment[] = attachments.map((a) => ({
      filename: a.filename,
      content: a.dataUrl.includes(",") ? a.dataUrl.split(",")[1] : a.dataUrl,
    }));

    await onSend({
      to,
      cc,
      bcc,
      subject: subject.trim(),
      body: body || stripHtml(html),
      html: htmlBody,
      attachments: attachmentPayload,
      scheduledAt,
    });
  };

  if (!open) return null;

  const windowStyle: React.CSSProperties = minimized
    ? {}
    : {
        left: expanded ? undefined : `calc(50% + ${position.x}px)`,
        top: expanded ? undefined : `calc(50% + ${position.y}px)`,
        transform: expanded ? undefined : "translate(-50%, -50%)",
      };

  return (
    <>
      {!minimized && <div className="nc-backdrop" onClick={onClose} aria-hidden />}
      <div
        ref={windowRef}
        className={`nc-window${minimized ? " nc-window--minimized" : ""}${expanded ? " nc-window--expanded" : ""}`}
        style={windowStyle}
        role="dialog"
        aria-label="New Broadcast"
      >
        <div className="nc-titlebar" onMouseDown={onTitleMouseDown}>
          <span className="nc-titlebar-title">New Broadcast</span>
          <div className="nc-titlebar-actions">
            <button
              type="button"
              className="nc-titlebar-btn"
              onClick={() => setMinimized((m) => !m)}
              aria-label="Minimize"
            >
              –
            </button>
            <button
              type="button"
              className="nc-titlebar-btn"
              onClick={() => {
                setExpanded((e) => !e);
                setMinimized(false);
              }}
              aria-label="Expand"
            >
              ⤢
            </button>
            <button type="button" className="nc-titlebar-btn" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        <div className="nc-fields">
          <div className="nc-row">
            <span className="nc-row-label">To:</span>
            <div className="nc-row-main">
              <RecipientField
                id="broadcast-to"
                lists={recipientLists}
                selectedListIds={selectedListIds}
                onSelectedListIdsChange={setSelectedListIds}
                manualEmails={manualTo}
                onManualEmailsChange={setManualTo}
                placeholder="Add a list or type an email"
              />
              {resolvedCount > 0 && (
                <p className="nc-recipient-summary">
                  {resolvedCount} recipient{resolvedCount === 1 ? "" : "s"} total
                </p>
              )}
            </div>
            <div className="nc-row-toggles">
              {!showCc && (
                <button type="button" className="nc-toggle-link" onClick={() => setShowCc(true)}>
                  Cc
                </button>
              )}
              {!showBcc && (
                <button type="button" className="nc-toggle-link" onClick={() => setShowBcc(true)}>
                  Bcc
                </button>
              )}
            </div>
          </div>

          {showCc && (
            <div className="nc-row">
              <span className="nc-row-label">Cc:</span>
              <div className="nc-row-main">
                <EmailChipInput value={cc} onChange={setCc} placeholder="Cc recipients" />
              </div>
            </div>
          )}

          {showBcc && (
            <div className="nc-row">
              <span className="nc-row-label">Bcc:</span>
              <div className="nc-row-main">
                <EmailChipInput value={bcc} onChange={setBcc} placeholder="Bcc recipients" />
              </div>
            </div>
          )}

          <div className="nc-row">
            <span className="nc-row-label">Subject:</span>
            <div className="nc-row-main">
              <input
                type="text"
                className="nc-subject-input"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>

          <div className="nc-body-wrap">
            <div className="nc-mode-toggle">
              <button
                type="button"
                className={`nc-mode-btn${!plainTextMode ? " active" : ""}`}
                onClick={() => setPlainTextMode(false)}
              >
                Rich Text
              </button>
              <button
                type="button"
                className={`nc-mode-btn${plainTextMode ? " active" : ""}`}
                onClick={() => setPlainTextMode(true)}
              >
                Plain Text
              </button>
            </div>

            {plainTextMode ? (
              <textarea
                className="nc-plain-body"
                value={plainBody}
                onChange={(e) => setPlainBody(e.target.value)}
                placeholder="Write your message…"
              />
            ) : (
              <NewsletterEditor content={html} onChange={setHtml} onUploadImage={uploadImage} />
            )}
          </div>
        </div>

        <div className="nc-attachments">
          <input
            ref={attachRef}
            type="file"
            multiple
            className="nc-hidden"
            onChange={(e) => onAttachFiles(e.target.files)}
          />
          <button type="button" className="nc-attach-btn" onClick={() => attachRef.current?.click()}>
            📎 Attach files
          </button>
          {attachments.map((a) => (
            <span key={a.filename + a.dataUrl.slice(0, 20)} className="nc-attach-chip">
              {a.filename}
              <button
                type="button"
                className="nc-chip-remove"
                onClick={() => setAttachments((prev) => prev.filter((x) => x !== a))}
                aria-label={`Remove ${a.filename}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        {showSchedule && (
          <div className="nc-schedule-panel">
            <label>
              Send at:{" "}
              <input
                type="datetime-local"
                value={scheduledAt ?? ""}
                onChange={(e) => setScheduledAt(e.target.value || null)}
              />
            </label>
            {scheduledAt && (
              <button type="button" className="nc-toggle-link" onClick={() => setScheduledAt(null)}>
                Clear
              </button>
            )}
          </div>
        )}

        <div className="nc-actionbar">
          <button
            type="button"
            className="nc-send-btn"
            disabled={sending || !subject.trim() || resolvedCount === 0}
            onClick={handleSend}
          >
            {sending ? "Sending…" : scheduledAt ? "Schedule Broadcast" : "Send Broadcast"}
          </button>
          <button type="button" className="nc-secondary-btn" onClick={saveDraft}>
            Save Draft
          </button>
          <button type="button" className="nc-secondary-btn" onClick={discard}>
            Discard ✕
          </button>
          <span className="nc-actionbar-spacer" />
          <button
            type="button"
            className="nc-icon-btn"
            onClick={() => attachRef.current?.click()}
            title="Attach files"
          >
            📎
          </button>
          <button
            type="button"
            className="nc-icon-btn"
            onClick={() => setShowSchedule((s) => !s)}
            title="Schedule"
          >
            🕐
          </button>
        </div>
      </div>
    </>
  );
}
