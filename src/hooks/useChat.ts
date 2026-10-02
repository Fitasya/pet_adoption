import { useEffect, useRef, useState } from "react";
import type { ChatMessage, ClientEvent, ServerEvent, UserRole } from "../types";

// the messages `reader` is expected to read = the ones from the other side
const isForReader = (m: ChatMessage, reader: UserRole) =>
  reader === "applicant"
    ? m.fromId !== m.conversationId
    : m.fromId === m.conversationId;

export function useChat(
  myId: string,
  role: UserRole,
  conversationId: string | null,
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const conversationIdRef = useRef(conversationId);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // load the conversation's history
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    fetch(`http://localhost:5000/api/messages?conversationId=${conversationId}`)
      .then((r) => r.json())
      .then(setMessages);
  }, [conversationId]);

  // one socket per logged-in user
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:5000/ws?userId=${myId}`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      if (wsRef.current === ws) setConnected(false);
    };

    ws.onmessage = (e) => {
      const event: ServerEvent = JSON.parse(e.data);

      if (event.type === "message") {
        const m = event.message;
        if (m.conversationId === conversationIdRef.current) {
          setMessages((prev) => [...prev, m]);
        }
      } else if (event.type === "read") {
        if (event.conversationId === conversationIdRef.current) {
          setMessages((prev) =>
            prev.map((m) =>
              isForReader(m, event.readBy) && !m.readAt
                ? { ...m, readAt: event.readAt }
                : m,
            ),
          );
        }
      }
    };

    return () => ws.close();
  }, [myId]);

  // while this conversation is open, tell the server about messages I haven't read
  useEffect(() => {
    if (!connected || !conversationId) return;

    const hasUnread = messages.some(
      (m) =>
        m.conversationId === conversationId &&
        isForReader(m, role) &&
        !m.readAt,
    );
    if (!hasUnread) return;

    const event: ClientEvent = { type: "read", conversationId };
    wsRef.current?.send(JSON.stringify(event));

    const now = new Date().toISOString();
    setMessages((prev) =>
      prev.map((m) =>
        isForReader(m, role) && !m.readAt ? { ...m, readAt: now } : m,
      ),
    );
  }, [messages, connected, conversationId, role]);

  const send = (text: string) => {
    if (!conversationId || wsRef.current?.readyState !== WebSocket.OPEN) return;
    const event: ClientEvent = { type: "send", conversationId, text };
    wsRef.current.send(JSON.stringify(event));
  };

  return { messages, send };
}