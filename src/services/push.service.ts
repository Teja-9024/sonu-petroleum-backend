export function isExpoPushToken(token: string) {
  return typeof token === "string" && token.startsWith("ExponentPushToken[");
}

type PushPayload = { title: string; body: string; data?: Record<string, any> };

export async function sendExpoPush(tokens: string[], payload: PushPayload) {
  const valid = tokens.filter(isExpoPushToken);
  if (valid.length === 0) return;

  const messages = valid.map((to) => ({
    to,
    sound: "default",
    title: payload.title,
    body: payload.body,
    data: payload.data ?? {},
  }));

  const resp = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Accept": "application/json",
    },
    body: JSON.stringify(messages),
  });

  if (!resp.ok) {
    console.error("Expo push error:", resp.status, await resp.text());
  }
}
