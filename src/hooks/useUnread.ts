import { useEffect, useState } from "react";
import type { ServerEvent } from "../types";

export function useUnread(myId: string | undefined) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!myId) {
      setCounts({});
      return;
    }

    const ws = new WebSocket(`ws://localhost:5000/ws?userId=${myId}`);
    ws.onmessage = (e) => {
      const event: ServerEvent = JSON.parse(e.data);
      if (event.type === "unread") setCounts(event.counts);
    };

    return () => ws.close();
  }, [myId]);

  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  return { counts, total };
}