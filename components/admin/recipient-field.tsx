"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import type { RecipientList } from "@/lib/newsletter/recipient-lists";

type RecipientFieldProps = {
  lists: RecipientList[];
  selectedListIds: string[];
  onSelectedListIdsChange: (ids: string[]) => void;
  manualEmails: string[];
  onManualEmailsChange: (emails: string[]) => void;
  placeholder?: string;
  id?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseEmails(raw: string): string[] {
  return raw
    .split(/[,;\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => EMAIL_RE.test(e));
}

export function RecipientField({
  lists,
  selectedListIds,
  onSelectedListIdsChange,
  manualEmails,
  onManualEmailsChange,
  placeholder = "Type an email and press Enter",
  id,
}: RecipientFieldProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const availableLists = lists.filter((l) => !selectedListIds.includes(l.id));

  const addList = (listId: string) => {
    if (!listId || selectedListIds.includes(listId)) return;
    onSelectedListIdsChange([...selectedListIds, listId]);
  };

  const removeList = (listId: string) => {
    onSelectedListIdsChange(selectedListIds.filter((id) => id !== listId));
  };

  const addEmails = useCallback(
    (raw: string) => {
      const next = parseEmails(raw);
      if (!next.length) return;
      const merged = [...manualEmails];
      for (const email of next) {
        if (!merged.includes(email)) merged.push(email);
      }
      onManualEmailsChange(merged);
      setInput("");
    },
    [manualEmails, onManualEmailsChange]
  );

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) addEmails(input);
    } else if (e.key === "Backspace" && !input) {
      if (manualEmails.length) {
        onManualEmailsChange(manualEmails.slice(0, -1));
      } else if (selectedListIds.length) {
        onSelectedListIdsChange(selectedListIds.slice(0, -1));
      }
    }
  };

  return (
    <div className="nc-recipient-field">
      {availableLists.length > 0 && (
        <div className="nc-recipient-lists-bar">
          <label className="nc-recipient-lists-label" htmlFor={id ? `${id}-list` : undefined}>
            Lists:
          </label>
          <select
            id={id ? `${id}-list` : undefined}
            className="nc-recipient-list-select"
            value=""
            onChange={(e) => {
              addList(e.target.value);
              e.target.value = "";
            }}
          >
            <option value="">Add a list…</option>
            {availableLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.label} ({list.count})
              </option>
            ))}
          </select>
          <div className="nc-recipient-list-quick">
            {availableLists.map((list) => (
              <button
                key={list.id}
                type="button"
                className="nc-recipient-list-pill"
                onClick={() => addList(list.id)}
              >
                + {list.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="nc-chip-field" onClick={() => inputRef.current?.focus()}>
        {selectedListIds.map((listId) => {
          const list = lists.find((l) => l.id === listId);
          if (!list) return null;
          return (
            <span key={listId} className="nc-chip nc-chip--list">
              {list.label}
              <span className="nc-chip-count">{list.count}</span>
              <button
                type="button"
                className="nc-chip-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeList(listId);
                }}
                aria-label={`Remove ${list.label}`}
              >
                ✕
              </button>
            </span>
          );
        })}

        {manualEmails.map((email) => (
          <span key={email} className="nc-chip">
            {email}
            <button
              type="button"
              className="nc-chip-remove"
              onClick={(e) => {
                e.stopPropagation();
                onManualEmailsChange(manualEmails.filter((e) => e !== email));
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
          placeholder={
            selectedListIds.length === 0 && manualEmails.length === 0 ? placeholder : ""
          }
          className="nc-chip-input"
        />
      </div>
    </div>
  );
}
