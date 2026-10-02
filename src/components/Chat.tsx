import { useEffect, useRef, useState } from "react";
import type { User } from "../types";
import { useChat } from "../hooks/useChat";

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDay = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export function Chat({
  currentUser,
  unreadCounts,
}: {
  currentUser: User;
  unreadCounts: Record<string, number>;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(
    currentUser.role === "applicant" ? currentUser.id : null,
  );
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messages, send } = useChat(
    currentUser.id,
    currentUser.role,
    selectedId,
  );

  useEffect(() => {
    if (currentUser.role !== "reviewer") return;
    fetch("http://localhost:5000/api/users")
      .then((r) => r.json())
      .then((all: User[]) =>
        setUsers(all.filter((u) => u.role === "applicant")),
      );
  }, [currentUser.role]);

  // scroll to newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    send(text);
    setText("");
  };

  const selectedUser = users.find((u) => u.id === selectedId);
  const lastMineId = [...messages]
    .reverse()
    .find((m) => m.fromId === currentUser.id)?.id;

  return (
    <div className="max-w-3xl mx-auto flex gap-4">
      {currentUser.role === "reviewer" && (
        <div
          className="w-56 shrink-0 h-fit max-h-120 overflow-y-auto 
         rounded-2xl bg-transparent dark:bg-slate-800 p-2 space-y-1 mt-0"
        >
          <h3
            className="px-2 pt-0 pb-2 text-xs font-semibold uppercase 
          tracking-wide text-slate-500"
          >
            All users
          </h3>

          {users.map((u) => {
            const unread = unreadCounts[u.id] || 0;
            const selected = u.id === selectedId;

            return (
              <button
                key={u.id}
                onClick={() => setSelectedId(u.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 
                  rounded-2xl text-left cursor-pointer transition-colors ${
                    selected
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
                      : "hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
              >
                <span className="h-8 w-8 shrink-0 rounded-full bg-orange-500 text-white text-sm font-semibold flex items-center justify-center">
                  {u.name.charAt(0)}
                </span>

                <span
                  className={`flex-1 truncate ${unread > 0 ? "font-semibold" : ""}`}
                >
                  {u.name}
                </span>

                {unread > 0 && (
                  <span className="min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex-1">
        <h2 className="font-semibold mb-2">
          {currentUser.role === "applicant"
            ? "Chat with the review team"
            : selectedUser
              ? `Chat with ${selectedUser.name}`
              : "Select someone to chat with"}
        </h2>

        <div
          className="h-[calc(100vh-190px)] overflow-y-auto border-0 border-slate-400 
        rounded-2xl p-3 space-y-2 bg-transparent"
        >
          {messages.map((m, i) => {
            const prev = messages[i - 1];
            const isMine = m.fromId === currentUser.id;
            const isApplicantMsg = m.fromId === m.conversationId;
            const showDate =
              i === 0 ||
              new Date(m.sentAt).toDateString() !==
                new Date(prev.sentAt).toDateString();
            // name only when the sender changes (or a new day starts)
            const showName = !isMine && (showDate || prev?.fromId !== m.fromId);

            const bubbleColor = isMine
              ? "bg-orange-600 text-white"
              : isApplicantMsg
                ? "bg-slate-200 dark:bg-slate-700"
                : "bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-100";

            const nameColor = isApplicantMsg
              ? "text-slate-500"
              : "text-sky-700 dark:text-sky-300";

            return (
              <div key={m.id}>
                {showDate && (
                  <div className="text-center text-xs text-slate-500 my-2">
                    {formatDay(m.sentAt)}
                  </div>
                )}

                <div className={isMine ? "text-right" : "text-left"}>
                  {showName && (
                    <div className={`text-xs mb-0.5 ${nameColor}`}>
                      {m.senderName}
                    </div>
                  )}
                  <span
                    className={`relative text-left inline-block px-3 py-1 rounded-xl max-w-3/4 pr-10 ${bubbleColor}`}
                  >
                    {m.text}
                    <span className="ml-2 text-[10px] opacity-70 right-2 bottom-0 absolute">
                      {formatTime(m.sentAt)}
                    </span>
                  </span>
                  {m.id === lastMineId && (
                    <div className="text-xs text-slate-500">
                      {m.readAt ? "Seen" : "Sent"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2 mt-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="flex-1 border rounded-xl px-3 py-2 
            focus:outline-none bg-white
            focus:ring-2 focus:ring-orange-500
            focus:border-orange-500
                focus:bg-orange-50/50 
                       border-slate-400
                "
            placeholder="Type a message..."
          />
          <button
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white  
            disabled:opacity-50 disabled:cursor-not-allowed 
            hover:cursor-pointer px-4 py-2 rounded-xl "
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
