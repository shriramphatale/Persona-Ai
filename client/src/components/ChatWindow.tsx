
import { useEffect, useRef, useMemo } from "react";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { ChatStore, type Message, } from "../store/chatStore";

export default function ChatWindow() {
  const bottomRef = useRef<HTMLDivElement>(null);

  const {messages, sendMessage, isTyping, selectedPersona, setSelectedPersona} = ChatStore()

  const allMessages = useMemo(() => {
    if (!selectedPersona) return [];
    return messages[selectedPersona.id] || [];
  }, [messages, selectedPersona]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [allMessages]);

  const onBack = () => {
    setSelectedPersona(null)
  }

  if (!selectedPersona) return null;

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#09090b] text-zinc-100">

      {/* Header */}
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-zinc-800/80 px-4 sm:px-6">

        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onBack}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            aria-label="Go back"
          >
            <ArrowLeft size={19} />
          </button>


          <div className="relative shrink-0">
            <img
              src={selectedPersona?.image}
              alt={selectedPersona?.name}
              className="h-10 w-10 rounded-full border border-zinc-700 object-cover"
            />

            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#09090b] bg-emerald-500" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold tracking-tight text-zinc-100">
              {selectedPersona?.name}
            </h2>

            {/* <p className="truncate text-xs text-zinc-500">
              {selectedPersona?.subtitle || "AI Persona"}
            </p> */}
          </div>
        </div>

        <button
          aria-label="More options"
          className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        >
          <MoreHorizontal size={21} />
        </button>
      </header>

      {/* Chat messages */}
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-6 sm:px-6">

          {allMessages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <img
                src={selectedPersona?.image}
                alt={selectedPersona?.name}
                className="mb-5 h-16 w-16 rounded-full border border-zinc-700 object-cover"
              />

              <h2 className="text-xl font-semibold tracking-tight">
                {selectedPersona?.name}
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
                Start a conversation. Ask anything and explore new ideas.
              </p>

              <div className="mt-5 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-500">
                New conversation
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {allMessages.map((message: Message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  personaImage={selectedPersona?.image}
                  personaName={selectedPersona?.name}
                />
              ))}
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="mt-8 flex items-center gap-3">
              <img
                src={selectedPersona.image}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />

              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((item) => (
                  <span
                    key={item}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500"
                    style={{ animationDelay: `${item * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Message composer */}
      <footer className="shrink-0 border-t border-zinc-800/80 bg-[#09090b] px-3 pb-4 pt-4 sm:px-6 sm:pb-5">
        <div className="mx-auto max-w-3xl">
          <ChatInput
            onSend={sendMessage}
            disabled={isTyping}
            selectedPersona ={selectedPersona}
          />
        </div>
      </footer>
    </div>
  );
}
