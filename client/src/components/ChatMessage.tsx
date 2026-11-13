import { type Message } from "../store/chatStore";

interface ChatMessageProps {
  message: Message;
  personaImage: string;
  personaName: string;
}

export default function ChatMessage({ message, personaImage, personaName,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <img
          src={personaImage}
          alt={personaName}
          className="mt-1 h-8 w-8 shrink-0 rounded-full border border-zinc-800 object-cover"
        />
      )}

      <div
        className={`flex min-w-0 flex-col ${
          isUser
            ? "max-w-[85%] items-end sm:max-w-[75%]"
            : "max-w-[90%] flex-1 items-start sm:max-w-[85%]"
        }`}
      >
        {!isUser && (
          <span className="mb-2 text-sm font-semibold text-zinc-200">
            {personaName}
          </span>
        )}

        <div
          className={`whitespace-pre-wrap break-words text-[14px] leading-7 sm:text-[15px] ${
            isUser
              ? "rounded-2xl rounded-br-md border border-zinc-700/70 bg-zinc-800/80 px-4 py-3 text-zinc-100"
              : "text-zinc-300"
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
