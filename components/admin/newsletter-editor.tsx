"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { FontSize } from "@/lib/tiptap/font-size";

const FONT_FAMILIES = [
  { label: "DM Sans", value: "DM Sans, sans-serif" },
  { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
];

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px"];

const HeaderImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: "nc-header-image",
        parseHTML: (el) => el.getAttribute("class"),
        renderHTML: (attrs) => ({ class: attrs.class }),
      },
    };
  },
});

type NewsletterEditorProps = {
  content: string;
  onChange: (html: string) => void;
  onUploadImage?: (file: File) => Promise<string | null>;
};

export function NewsletterEditor({ content, onChange, onUploadImage }: NewsletterEditorProps) {
  const [imagePanelOpen, setImagePanelOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      HeaderImage.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "nc-editor-prose" },
    },
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (content !== current) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  const insertHeaderImage = useCallback(
    async (src: string) => {
      if (!editor || !src) return;
      editor
        .chain()
        .focus()
        .insertContentAt(0, {
          type: "image",
          attrs: { src, class: "nc-header-image", style: "width:100%;display:block;margin:0 0 16px" },
        })
        .run();
      setImagePanelOpen(false);
      setImageUrl("");
    },
    [editor]
  );

  const onImageFile = async (file: File | null) => {
    if (!file || !onUploadImage) return;
    const url = await onUploadImage(file);
    if (url) await insertHeaderImage(url);
  };

  const setLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="nc-editor">
      <div className="nc-toolbar">
        <select
          className="nc-toolbar-select"
          value={editor.getAttributes("textStyle").fontFamily ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            if (v) editor.chain().focus().setFontFamily(v).run();
            else editor.chain().focus().unsetFontFamily().run();
          }}
        >
          <option value="">Font Family</option>
          {FONT_FAMILIES.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <select
          className="nc-toolbar-select"
          value={editor.getAttributes("textStyle").fontSize ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            if (v) editor.chain().focus().setFontSize(v).run();
            else editor.chain().focus().unsetFontSize().run();
          }}
        >
          <option value="">Font Size</option>
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>
              {s.replace("px", "")}
            </option>
          ))}
        </select>

        <span className="nc-toolbar-divider" />

        <button
          type="button"
          className={`nc-toolbar-btn${editor.isActive("bold") ? " active" : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          className={`nc-toolbar-btn${editor.isActive("italic") ? " active" : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          className={`nc-toolbar-btn${editor.isActive("underline") ? " active" : ""}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          U
        </button>
        <button
          type="button"
          className={`nc-toolbar-btn${editor.isActive("strike") ? " active" : ""}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          S
        </button>

        <span className="nc-toolbar-divider" />

        <button
          type="button"
          className={`nc-toolbar-btn${editor.isActive({ textAlign: "left" }) ? " active" : ""}`}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Align left"
        >
          ←
        </button>
        <button
          type="button"
          className={`nc-toolbar-btn${editor.isActive({ textAlign: "center" }) ? " active" : ""}`}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Align center"
        >
          ↔
        </button>
        <button
          type="button"
          className={`nc-toolbar-btn${editor.isActive({ textAlign: "right" }) ? " active" : ""}`}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Align right"
        >
          →
        </button>

        <span className="nc-toolbar-divider" />

        <button
          type="button"
          className={`nc-toolbar-btn${editor.isActive("bulletList") ? " active" : ""}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          •
        </button>
        <button
          type="button"
          className={`nc-toolbar-btn${editor.isActive("orderedList") ? " active" : ""}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
        >
          1.
        </button>

        <span className="nc-toolbar-divider" />

        <button type="button" className="nc-toolbar-btn" onClick={setLink} title="Link">
          🔗
        </button>
        <button
          type="button"
          className="nc-toolbar-btn"
          onClick={() => setImagePanelOpen((o) => !o)}
          title="Header image"
        >
          📷
        </button>

        <span className="nc-toolbar-divider" />

        <label className="nc-toolbar-color" title="Text color">
          <span>A</span>
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
        </label>
        <label className="nc-toolbar-color" title="Highlight">
          <span>◼</span>
          <input
            type="color"
            defaultValue="#fff59d"
            onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
          />
        </label>
      </div>

      {imagePanelOpen && (
        <div className="nc-image-panel">
          <p className="nc-image-panel-title">Insert header image (full width at top)</p>
          <div className="nc-image-panel-row">
            <input
              type="url"
              placeholder="Paste image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="nc-image-url-input"
            />
            <button type="button" className="nc-mini-btn" onClick={() => insertHeaderImage(imageUrl)}>
              Insert URL
            </button>
          </div>
          <div className="nc-image-panel-row">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="nc-hidden"
              onChange={(e) => onImageFile(e.target.files?.[0] ?? null)}
            />
            <button type="button" className="nc-mini-btn" onClick={() => fileRef.current?.click()}>
              Upload file
            </button>
          </div>
        </div>
      )}

      <EditorContent editor={editor} className="nc-editor-body" />
    </div>
  );
}
