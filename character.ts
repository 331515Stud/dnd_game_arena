"use client";

import type { PublicCharacter } from "@/lib/serializeCharacter";
import { Download, ExternalLink, Radio, ShieldAlert, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SHEET_ORIGIN = "https://longstoryshort.app";
const IFRAME_URL = `${SHEET_ORIGIN}/iframe/characters/list/`;

type BridgeEvent = {
  character: string;
  title: string;
  formula: string;
  total: string;
  crit: "" | "success" | "failure";
  at: string;
};

/**
 * Live bridge to Long Story Short. The sheet itself keeps running on lss.app
 * (each player opens their own character there); what crosses the frame boundary
 * is only the documented postMessage protocol from @longstoryshort/vtt-sdk:
 * rolls come out, HP commands go in.
 */
export function LssBridge({ character }: { character: PublicCharacter }) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "connecting" | "live" | "blocked">("idle");
  const [events, setEvents] = useState<BridgeEvent[]>([]);
  const [delta, setDelta] = useState(-5);

  useEffect(() => {
    if (!open) return;
    let disposed = false;
    let dispose: (() => void) | undefined;
    let source: { onEvent(cb: (event: unknown) => void): () => void; dispose(): void } | null = null;

    setStatus("connecting");
    (async () => {
      try {
        const sdk = await import("@longstoryshort/vtt-sdk");
        if (disposed || !frameRef.current) return;
        source = sdk.createBridgeSheetSource({
          // The SDK reads `contentWindow` live on every message, so a plain ref object is enough.
          iframe: { contentWindow: frameRef.current.contentWindow },
          allowedOrigins: [SHEET_ORIGIN],
        }) as unknown as { onEvent(cb: (event: unknown) => void): () => void; dispose(): void };
        source.onEvent((raw) => {
          const event = raw as {
            type: string;
            payload: Record<string, unknown> & { total?: string; breakdown?: string };
          };
          if (event.type === "lss:roll") {
            const payload = event.payload as unknown as {
              characterName?: string;
              title?: string;
              formula?: string;
              total?: string;
              isCrit?: boolean;
              critKind?: "success" | "failure";
            };
            setStatus("live");
            setEvents((prev) =>
              [
                {
                  character: payload.characterName ?? "Лист LSS",
                  title: payload.title ?? "Бросок",
                  formula: payload.formula ?? "",
                  total: String(payload.total ?? "—"),
                  crit: (payload.isCrit ? (payload.critKind ?? "success") : "") as BridgeEvent["crit"],
                  at: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
                },
                ...prev,
              ].slice(0, 10),
            );
            return;
          }
          if (event.type === "lss:manifest" || event.type === "dnd:health") {
            setStatus("live");
          }
        });
        dispose = () => source?.dispose();
      } catch {
        if (!disposed) setStatus("blocked");
      }
    })();

    return () => {
      disposed = true;
      dispose?.();
    };
  }, [open]);

  async function pushHealth() {
    const sdk = await import("@longstoryshort/vtt-sdk").catch(() => null);
    const frame = frameRef.current;
    if (!sdk || !frame?.contentWindow) return;
    const source = sdk.createBridgeSheetSource({
      iframe: { contentWindow: frame.contentWindow },
      allowedOrigins: [SHEET_ORIGIN],
    });
    source.send({ type: "lss:command", payload: { op: "adjust", capabilityId: "hp", delta } });
    source.dispose();
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-fantasy text-lg text-amber-100">
            <Radio className={`h-4 w-4 ${status === "live" ? "text-emerald-400" : "text-slate-500"}`} />
            Мост Long Story Short
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Статус протокола:{" "}
            <span className={status === "live" ? "text-emerald-400" : "text-amber-300"}>
              {status === "idle" ? "ожидание" : status === "connecting" ? "подключение" : status === "live" ? "лист на связи" : "браузер заблокировал канал"}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/api/characters/${character.id}/export?format=lss`}
            download
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-2.5 py-1.5 text-[11px] font-black text-slate-950"
          >
            <Download className="h-3.5 w-3.5" /> Файл .json
          </a>
          <a
            href={IFRAME_URL.replace("/iframe/", "/")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1.5 text-[11px] font-bold text-slate-300"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Открыть LSS
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1.5 text-[11px] font-bold text-slate-300"
          >
            {open ? <X className="h-3.5 w-3.5" /> : <Radio className="h-3.5 w-3.5" />}
            {open ? "Закрыть панель" : "Встроить лист"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mt-4 space-y-3">
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
            <iframe
              ref={frameRef}
              src={IFRAME_URL}
              title="Лист персонажа Long Story Short"
              sandbox={
                "allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms allow-modals"
              }
              allow="clipboard-write"
              className="h-[560px] w-full"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400">Отправить в лист:</span>
            {[-1, -5, -10].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setDelta(value);
                  void pushHealth();
                }}
                className="rounded-lg border border-rose-800/60 px-2.5 py-1 text-[11px] font-bold text-rose-200"
              >
                урон {value} HP
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setDelta(5);
                void pushHealth();
              }}
              className="rounded-lg border border-emerald-800/60 px-2.5 py-1 text-[11px] font-bold text-emerald-200"
            >
              лечение +5 HP
            </button>
            <button
              type="button"
              onClick={() => void pushHealth()}
              className="rounded-lg border border-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-300"
            >
              своё: {delta}
            </button>
            <input
              type="number"
              value={delta}
              onChange={(event) => setDelta(Number(event.target.value) || 0)}
              className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-white"
            />
          </div>
          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-500">
            <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Лист живёт в сессии игрока на {SHEET_ORIGIN.replace("https://", "")} — мы не читаем его DOM, куки и токен. Через границу кадра идут
            только типизированные события протокола: броски наружу, команды по здоровью внутрь. Броски вашего листа начнут появляться в списке ниже,
            как только игрок откроет свой лист в этой панели.
          </p>
        </div>
      ) : (
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          Панель встраивает официальный iframe-лист Long Story Short. Игрок выбирает своего персонажа внутри — арена получает броски и может
          двигать его здоровье командами протокола.
        </p>
      )}

      {events.length ? (
        <ul className="mt-4 space-y-2">
          {events.map((event, index) => (
            <li key={`${event.at}-${index}`} className="flex items-center justify-between gap-3 rounded-xl bg-slate-950/80 px-3 py-2">
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold text-white">
                  {event.character} · {event.title}
                </span>
                <span className="text-[10px] text-slate-500">{event.formula}</span>
              </span>
              <span
                className={`font-fantasy text-lg ${
                  event.crit === "success" ? "text-emerald-400" : event.crit === "failure" ? "text-rose-400" : "text-amber-200"
                }`}
              >
                {event.total}
              </span>
              <span className="text-[10px] text-slate-600">{event.at}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
