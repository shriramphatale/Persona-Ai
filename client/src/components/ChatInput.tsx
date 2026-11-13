
import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent,} from "react";
import {ArrowUp,} from "lucide-react";
import { type Persona, } from "../store/chatStore";

interface ChatInputProps {
  onSend: (personaId: string ,message: string) => void;
  disabled?: boolean;
  selectedPersona: Persona;
}

export default function ChatInput({
  onSend,
  disabled = false,
  selectedPersona,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [message]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || disabled) return;
    onSend(selectedPersona.id ,trimmed);
    setMessage("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-2 shadow-lg shadow-black/20 transition-all focus-within:border-zinc-600"
    >
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        placeholder={`Message ${selectedPersona.name || "..."}`}
        className="max-h-40 min-h-10 w-full resize-none bg-transparent px-3 py-2.5 text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-600 disabled:opacity-50"
      />

      <div className="flex items-center justify-between px-1 pb-1">
        <div className="flex items-center gap-1">
          {/* <button
            type="button"
            aria-label="More options"
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
          >
            <Plus size={19} />
          </button>

          <button
            type="button"
            aria-label="Attach file"
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
          >
            <Paperclip size={18} />
          </button> */}
        </div>

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          aria-label="Send message"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
        >
          <ArrowUp size={19} strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}
