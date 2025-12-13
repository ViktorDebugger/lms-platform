"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { useEffect, useState } from "react";
import { List, ListOrdered, Link as LinkIcon, Quote } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

export const Editor = ({ onChange, value }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Link.configure({
        openOnClick: false,
        defaultProtocol: undefined,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Underline,
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-4 [&_h1]:leading-tight [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-3 [&_h2]:leading-tight [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_h4]:text-lg [&_h4]:font-bold [&_h4]:mt-3 [&_h4]:mb-2 [&_h5]:text-base [&_h5]:font-bold [&_h5]:mt-3 [&_h5]:mb-1 [&_h6]:text-sm [&_h6]:font-bold [&_h6]:mt-2 [&_h6]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:my-4 [&_blockquote]:bg-gray-50 [&_blockquote]:py-2",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded-md border bg-white">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

const EditorToolbar = ({ editor }: { editor: any }) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const handleOpenLinkDialog = () => {
    const previousUrl = editor.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
    setIsLinkDialogOpen(true);
  };

  const handleSetLink = () => {
    if (linkUrl.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl.trim() })
        .run();
    }
    setIsLinkDialogOpen(false);
    setLinkUrl("");
  };

  const handleRemoveLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setIsLinkDialogOpen(false);
    setLinkUrl("");
  };

  if (!editor) {
    return null;
  }

  const hasLink = editor.isActive("link");
  const currentLinkUrl = editor.getAttributes("link").href;

  const handleToggleHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    if (editor.isActive("heading", { level })) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-1 border-b p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("underline") ? "bg-gray-200" : ""
          }`}
        >
          <u>U</u>
        </button>
        <div className="mx-1 h-6 w-px bg-gray-300" />
        <button
          type="button"
          onClick={() => handleToggleHeading(1)}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
          }`}
          title="Заголовок 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => handleToggleHeading(2)}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
          }`}
          title="Заголовок 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => handleToggleHeading(3)}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
          }`}
          title="Заголовок 3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => handleToggleHeading(4)}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("heading", { level: 4 }) ? "bg-gray-200" : ""
          }`}
          title="Заголовок 4"
        >
          H4
        </button>
        <button
          type="button"
          onClick={() => handleToggleHeading(5)}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("heading", { level: 5 }) ? "bg-gray-200" : ""
          }`}
          title="Заголовок 5"
        >
          H5
        </button>
        <button
          type="button"
          onClick={() => handleToggleHeading(6)}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("heading", { level: 6 }) ? "bg-gray-200" : ""
          }`}
          title="Заголовок 6"
        >
          H6
        </button>
        <div className="mx-1 h-6 w-px bg-gray-300" />
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleBulletList().run();
          }}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("bulletList") ? "bg-gray-200" : ""
          }`}
          title="Ненумерований список"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
          title="Нумерований список"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <div className="mx-1 h-6 w-px bg-gray-300" />
        <button
          type="button"
          onClick={() => {
            if (editor.isActive("blockquote")) {
              editor.chain().focus().toggleBlockquote().run();
            } else {
              editor.chain().focus().toggleBlockquote().run();
            }
          }}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("blockquote") ? "bg-gray-200" : ""
          }`}
          title="Цитата"
        >
          <Quote className="h-4 w-4" />
        </button>
        <div className="mx-1 h-6 w-px bg-gray-300" />
        <button
          type="button"
          onClick={handleOpenLinkDialog}
          className={`rounded p-2 hover:bg-gray-100 ${
            hasLink ? "bg-gray-200" : ""
          }`}
          title={hasLink ? `Посилання: ${currentLinkUrl}` : "Додати посилання"}
        >
          <LinkIcon className="h-4 w-4" />
        </button>
      </div>

      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {hasLink ? "Редагувати посилання" : "Додати посилання"}
            </DialogTitle>
            <DialogDescription>
              Введіть повний URL посилання (наприклад: https://example.com)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSetLink();
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            {hasLink && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleRemoveLink}
              >
                Видалити
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsLinkDialogOpen(false)}
            >
              Скасувати
            </Button>
            <Button type="button" onClick={handleSetLink}>
              {hasLink ? "Оновити" : "Додати"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
