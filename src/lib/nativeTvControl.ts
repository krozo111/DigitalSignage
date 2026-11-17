import { ScreenCommandKind } from "@/lib/screenCommands";

type NativeReply = { id: string; status: "applied" | "unsupported" | "failed" };
type NativeBridge = {
  postMessage(message: string): void;
  addEventListener(type: "message", listener: (event: MessageEvent<string>) => void): void;
  removeEventListener(type: "message", listener: (event: MessageEvent<string>) => void): void;
};

/** Uses the origin-scoped WebView bridge. Older APKs report unsupported. */
export function sendNativeVolumeCommand(id: string, kind: ScreenCommandKind): Promise<NativeReply["status"]> {
  const nativeBridge = (window as Window & { YugoNative?: NativeBridge }).YugoNative;
  if (!nativeBridge) return Promise.resolve("unsupported");
  const bridge: NativeBridge = nativeBridge;

  return new Promise((resolve) => {
    const timer = setTimeout(() => finish("failed"), 5000);
    const onMessage = (event: MessageEvent<string>) => {
      try {
        const reply = JSON.parse(event.data) as NativeReply;
        if (reply.id === id && ["applied", "unsupported", "failed"].includes(reply.status)) {
          finish(reply.status);
        }
      } catch {
        // Ignore messages from another command or an older bridge version.
      }
    };
    function finish(status: NativeReply["status"]) {
      clearTimeout(timer);
      bridge.removeEventListener("message", onMessage);
      resolve(status);
    }

    bridge.addEventListener("message", onMessage);
    try {
      bridge.postMessage(JSON.stringify({ id, kind }));
    } catch {
      finish("failed");
    }
  });
}
