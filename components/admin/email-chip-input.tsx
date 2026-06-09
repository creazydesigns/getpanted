"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";

type EmailChipInputProps = {
  value: string[];
  onChange: (emails: string[]) => void;
  placeholder?: string;
  id?: string;
  className?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseEmails(raw: string): string[] {
  return raw
    .split(/[,;\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => EMAIL_RE.test(e));
}

export function EmailChipInput({
  value,
  onChange,
  placeholder = "Add recipients",
  id,
  className = "",
}: EmailChipInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addEmails = useCallback(
    (raw: string) => {
      const next = parseEmails(raw);
      if (!next.length) return;
      const merged = [...value];
      for (const email of next) {
        if (!merged.includes(email)) merged.push(email);
      }
      onChange(merged);
      setInput("");
    },
    [onChange, value]
  );

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) addEmails(input);
    } else if (e.key === "Backspace" && !input && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  const remove = (email: string) => onChange(value.filter((e) => e !== email));

  return (
    <div
      className={`nc-chip-field ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((email) => (
        <span key={email} className="nc-chip">
          {email}
          <button
            type="button"
            className="nc-chip-remove"
            onClick={(e) => {
              e.stopPropagation();
              remove(email);
            }}
            aria-label={`Remove ${email}`}
          >
            ✕
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          if (input.trim()) addEmails(input);
        }}
        placeholder={value.length === 0 ? placeholder : ""}
        className="nc-chip-input"
      />
    </div>
  );
}
