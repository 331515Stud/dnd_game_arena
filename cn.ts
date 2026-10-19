"use client";

import type { PublicCharacter } from "@/lib/serializeCharacter";
import {
  AlertTriangle,
  ArrowLeftRight,
  Check,
  ClipboardPaste,
  Download,
  FileJson,
  Loader2,
  Sparkles,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

const LSS_LIST_URL = "https://longstoryshort.app/characters/list/";
const LSS_IMPORT_STEPS = [
  "Скачайте лист из арены кнопкой «Скачать .json для LSS» — получится файл в формате Long Story Short.",
  `Откройте ${LSS_LIST_URL} и войдите в свой аккаунт.`,
  "Нажмите кнопку «.json» → «Загрузить .json» и выберите файл. Персонаж появится в списке.",
  "Чтобы вернуть героя обратно: скачайте его с LSS той же кнопкой «.json» и загрузите в левую колонку здесь.",
];

const SAMPLE_LSS = {
  tags: [],
  disabledBlocks: { "info-left": [], "info-right": [], "notes-left": [], "notes-right": [] },
  spells: { mode: "text", prepared: [], book: [] },
  jsonType: "character",
  version: "2",
  data: JSON.stringify({
    isDefault: true,
    jsonType: "character",
    template: "default",
    name: { value: "Мираэль Тихий Клинок" },
    info: {
      charClass: { name: "charClass", label: "класс и уровень", value: "Плут (3)" },
      level: { name: "level", label: "уровень", value: 3 },
      background: { name: "background", label: "предыстория", value: "Преступник" },
      playerName: { name: "playerName", label: "имя игрока", value: "Гость LSS" },
      race: { name: "race", label: "раса", value: "Полуэльф" },
      alignment: { name: "alignment", label: "мировоззрение", value: "Хаотично-нейтральный" },
      experience: { name: "experience", label: "опыт", value: 2700 },
    },
    subInfo: {
      age: { name: "age", label: "возраст", value: "" },
      skin: { name: "skin", label: "кожа", value: "Бледный, шрам через бровь" },
    },
    proficiency: 2,
    stats: {
      str: { name: "str", label: "Сила", score: 10, modifier: 0, check: 0 },
      dex: { name: "dex", label: "Ловкость", score: 17, modifier: 3, check: 3 },
      con: { name: "con", label: "Телосложение", score: 13, modifier: 1, check: 1 },
      int: { name: "int", label: "Интеллект", score: 12, modifier: 1, check: 1 },
      wis: { name: "wis", label: "Мудрость", score: 11, modifier: 0, check: 0 },
      cha: { name: "cha", label: "Харизма", score: 14, modifier: 2, check: 2 },
    },
    saves: {
      str: { name: "str", isProf: false },
      dex: { name: "dex", isProf: true },
      con: { name: "con", isProf: false },
      int: { name: "int", isProf: true },
      wis: { name: "wis", isProf: false },
      cha: { name: "cha", isProf: false },
    },
    skills: {
      "acrobatics": { baseStat: "dex", name: "acrobatics", label: "Акробатика", isProf: true },
      "stealth": { baseStat: "dex", name: "stealth", label: "Скрытность", isProf: true },
      "sleight of hand": { baseStat: "dex", name: "sleight of hand", label: "Ловкость рук", isProf: true },
      "deception": { baseStat: "cha", name: "deception", label: "Обман", isProf: true },
      "perception": { baseStat: "wis", name: "perception", label: "Внимание", isProf: false },
    },
    vitality: {
      "hit-die": { value: "d8" },
      ac: { value: 15 },
      speed: { value: 30 },
      initiative: { value: 3 },
      "hp-max": { value: 24 },
      "hp-current": { value: 19 },
      "hp-temp": { value: 0 },
    },
    text: {
      equipment: { value: { id: "hover-toolbar-equipment", data: { type: "doc", content: [
        { type: "paragraph", content: [{ type: "text", text: "Рапира" }] },
        { type: "paragraph", content: [{ type: "text", text: "Короткий лук" }] },
        { type: "paragraph", content: [{ type: "text", text: "Кожаный доспех" }] },
        { type: "paragraph", content: [{ type: "text", text: "Воровские инструменты" }] },
      ] } } },
      attacks: { value: { id: "hover-toolbar-attacks", data: { type: "doc", content: [
        { type: "paragraph", content: [{ type: "text", text: "Рапира +5 (1d8+3 колющий)" }] },
      ] } } },
      traits: { value: { id: "hover-toolbar-traits", data: { type: "doc", content: [
        { type: "paragraph", content: [{ type: "text", text: "Скрытая атака 2d6" }] },
        { type: "paragraph", content: [{ type: "text", text: "Хитрое действие" }] },
      ] } } },
      "spells-level-0": { value: { id: "hover-toolbar-spells-level-0", data: { type: "doc", content: [] } } },
      personality: { value: { id: "hover-toolbar-personality", data: { type: "doc", content: [
        { type: "paragraph", content: [{ type: "text", text: "Не беру долг дважды." }] },
      ] } } },
    },
    size: 9,
    coins: { cp: { value: 0 }, sp: { value: 3 }, ep: { value: 0 }, gp: { value: 120 }, pp: { value: 1 } },
    weaponsList: [
      { id: "weapon-mock-0", name: { value: "Рапира" }, mod: { value: "+5" }, dmg: { value: "1d8+3 колющий" }, ability: "dex", isProf: true },
    ],
    resources: {},
  }),
};

type Preview = {
  kind: string;
  payload: {
    name: string;
    race: string;
    className: string;
    background: string;
    level: number;
    sheet: {
      hpMax: number;
      hpCurrent: number;
      proficientSkills: string[];
      spells: unknown[];
      attacks: unknown[];
      equipment: string[];
    };
  };
  report: {
    mapping: { field: string; source: string; target: string }[];
    warnings: string[];
  };
};

export function TransferBridge({ roster }: { roster: PublicCharacter[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [raw, setRaw] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState("");
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selected, setSelected] = useState(roster[0]?.id ?? "");

  const load = useCallback(async (body: BodyInit, headers?: HeadersInit) => {
    setBusy(true);
    setError("");
    setSaved("");
    try {
      const response = await fetch("/api/characters/import?preview=1", { method: "POST", body, headers });
      const data = (await response.json()) as Preview & { ok: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Файл не подошёл");
      setPreview(data);
    } catch (err) {
      setPreview(null);
      setError(err instanceof Error ? err.message : "Не удалось разобрать файл");
    } finally {
      setBusy(false);
    }
  }, []);

  async function onFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const text = await file.text();
    setRaw(text);
    await load(text, { "Content-Type": "application/json" });
  }

  async function commit() {
    if (!raw) return;
    setBusy(true);
    try {
      const response = await fetch("/api/characters/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: raw,
      });
      const data = (await response.json()) as { ok: boolean; error?: string; character?: { id: string } };
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Ошибка записи");
      setSaved("Персонаж добавлен в архив арены.");
      router.push(data.character ? `/characters/${data.character.id}` : "/characters");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка импорта");
    } finally {
      setBusy(false);
    }
  }

  const selectedCharacter = roster.find((item) => item.id === selected) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
          <ArrowLeftRight className="h-3.5 w-3.5" /> Мост форматов
        </p>
        <h1 className="font-fantasy text-3xl font-black text-white sm:text-4xl">Long Story Short ↔ Арена</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          Один и тот же герой в двух системах. Экспорт собирает файл в родном для longstoryshort.app формате
          (конверт <code className="text-amber-200">jsonType:&quot;character&quot;, version 2</code> с блоками{" "}
          <code className="text-amber-200">info / stats / skills / vitality / text</code>), импорт разбирает его обратно
          в лист арены. Всё лежит в одном JSON, поэтому персонажа можно гонять между платформами без ручного перебивания.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Import side */}
        <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <header>
            <h2 className="font-fantasy text-xl text-amber-100">В арену ← файл LSS</h2>
            <p className="mt-1 text-xs text-slate-400">Перетащите .json, скачанный в «Мои персонажи» → «.json» → «Скачать .json».</p>
          </header>

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              void onFiles(event.dataTransfer.files);
            }}
            className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
              dragging ? "border-amber-400 bg-amber-500/10" : "border-slate-700 bg-slate-950/60"
            }`}
          >
            <Upload className="mx-auto h-6 w-6 text-amber-400" />
            <p className="mt-2 text-sm text-slate-300">Файл сюда — или выберите вручную</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-amber-200"
              >
                Выбрать .json
              </button>
              <button
                type="button"
                onClick={() => {
                  const text = JSON.stringify(SAMPLE_LSS, null, 2);
                  setRaw(text);
                  void load(text, { "Content-Type": "application/json" });
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-300"
              >
                <Sparkles className="h-3.5 w-3.5" /> Пример листа LSS
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(event) => void onFiles(event.target.files)}
              />
            </div>
          </div>

          <label className="block text-xs text-slate-400">
            …или вставьте JSON текстом
            <textarea
              value={raw}
              onChange={(event) => setRaw(event.target.value)}
              rows={7}
              placeholder='{"jsonType":"character","version":"2","data":"{...}"}'
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-[11px] leading-relaxed text-slate-200 outline-none focus:border-amber-500"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy || !raw.trim()}
              onClick={() => void load(raw, { "Content-Type": "application/json" })}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-slate-950 px-3 py-2 text-xs font-bold text-amber-200 disabled:opacity-40"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ClipboardPaste className="h-3.5 w-3.5" />}
              Разобрать
            </button>
            <button
              type="button"
              disabled={busy || !preview}
              onClick={() => void commit()}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-slate-950 disabled:opacity-40"
            >
              <FileJson className="h-3.5 w-3.5" /> Импортировать в арену
            </button>
          </div>

          {error ? (
            <p className="flex items-start gap-2 rounded-xl border border-rose-900/50 bg-rose-950/30 p-3 text-xs text-rose-200">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {error}
            </p>
          ) : null}
          {saved ? <p className="text-xs text-emerald-300">{saved}</p> : null}

          {preview ? (
            <div className="space-y-3 rounded-2xl border border-amber-500/20 bg-slate-950/70 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Источник: {preview.kind === "lss" ? "Long Story Short" : preview.kind === "arena" ? "лист арены" : "сырой JSON"}
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Info label="Имя" value={preview.payload.name} />
                <Info label="Раса" value={preview.payload.race} />
                <Info label="Класс" value={`${preview.payload.className} ${preview.payload.level} ур.`} />
                <Info label="Предыстория" value={preview.payload.background || "—"} />
                <Info label="Хиты" value={`${preview.payload.sheet.hpCurrent}/${preview.payload.sheet.hpMax}`} />
                <Info
                  label="Навыки / атаки / заклинания"
                  value={`${preview.payload.sheet.proficientSkills.length} / ${preview.payload.sheet.attacks.length} / ${preview.payload.sheet.spells.length}`}
                />
              </div>
              <table className="w-full text-left text-[11px]">
                <thead className="text-slate-500">
                  <tr>
                    <th className="py-1">Поле LSS</th>
                    <th className="py-1">Что прочитано</th>
                    <th className="py-1">Куда легло</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {preview.report.mapping.map((row) => (
                    <tr key={row.field}>
                      <td className="py-1.5 pr-2 font-mono text-amber-200">{row.field}</td>
                      <td className="py-1.5 pr-2 text-slate-300">{row.source}</td>
                      <td className="py-1.5 text-slate-400">{row.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.report.warnings.length ? (
                <ul className="space-y-1">
                  {preview.report.warnings.map((warning) => (
                    <li key={warning} className="flex gap-2 text-[11px] text-amber-200/90">
                      <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" /> {warning}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </section>

        {/* Export side */}
        <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <header>
            <h2 className="font-fantasy text-xl text-amber-100">В LSS ← из арены</h2>
            <p className="mt-1 text-xs text-slate-400">Выберите героя и скачайте файл, который принимает longstoryshort.app.</p>
          </header>

          {roster.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500">
              Архив пуст. Сначала соберите лист — <Link href="/characters/new" className="text-amber-300 underline">конструктор</Link>.
            </p>
          ) : (
            <>
              <select
                value={selected}
                onChange={(event) => setSelected(event.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
              >
                {roster.map((hero) => (
                  <option key={hero.id} value={hero.id}>
                    {hero.name} — {hero.className} {hero.level} ур. ({hero.race})
                  </option>
                ))}
              </select>

              {selectedCharacter ? (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Info label="Раса" value={`${selectedCharacter.race}${selectedCharacter.subrace ? ` (${selectedCharacter.subrace})` : ""}`} />
                  <Info label="Класс" value={`${selectedCharacter.className} ${selectedCharacter.level}`} />
                  <Info label="Хиты" value={`${selectedCharacter.sheet.hpCurrent}/${selectedCharacter.sheet.hpMax}`} />
                  <Info label="Монеты" value={`${selectedCharacter.sheet.gold} gp`} />
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <a
                  href={`/api/characters/${selected}/export?format=lss`}
                  download
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-slate-950"
                >
                  <Download className="h-3.5 w-3.5" /> Скачать .json для LSS
                </a>
                <a
                  href={`/api/characters/${selected}/export?format=arena`}
                  download
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300"
                >
                  <FileJson className="h-3.5 w-3.5" /> Файл арены (с LSS внутри)
                </a>
                <button
                  type="button"
                  onClick={async () => {
                    if (!selected) return;
                    const response = await fetch(`/api/characters/${selected}/export?format=lss`);
                    await navigator.clipboard.writeText(await response.text());
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1800);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <ClipboardPaste className="h-3.5 w-3.5" />}
                  {copied ? "Скопировано" : "JSON в буфер"}
                </button>
                <a
                  href={LSS_LIST_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 px-3 py-2 text-xs font-bold text-amber-200"
                >
                  Открыть «Мои персонажи»
                </a>
              </div>

              <ol className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                {LSS_IMPORT_STEPS.map((step, index) => (
                  <li key={step} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-800 text-[10px] font-bold text-amber-300">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </section>
      </div>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="font-fantasy text-lg text-amber-100">Общая схема соответствия</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="p-3">Лист арены</th>
                <th className="p-3">Long Story Short</th>
                <th className="p-3">Потери при переносе</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 bg-slate-950/40">
              {[
                ["name", "name.value", "нет"],
                ["race + subrace", "info.race.value («Дварф (Горный)»)", "подрана определяется по тексту"],
                ["className / level", "info.charClass.value, info.level.value", "нет"],
                ["background", "info.background.value", "нет"],
                ["alignment / experience", "info.alignment, info.experience", "нет"],
                ["baseAbilities + расовые бонусы", "stats.<ключ>.score / modifier", "итог считается заново из базы"],
                ["профицит спасбросков", "saves.<ключ>.isProf", "нет"],
                ["proficientSkills / expertiseSkills", "skills[«ловкость рук»].isProf", "компетентность едет двойным бонусом в листе"],
                ["hpCurrent / hpMax / hpTemp", "vitality['hp-current' | 'hp-max' | 'hp-temp']", "нет"],
                ["armor + shield", "vitality.ac.value", "доспех подбирается по итоговому КД"],
                ["speed", "vitality.speed.value", "нет"],
                ["attacks", "weaponsList[] + text.attacks", "заметки об атаке сливаются в строку"],
                ["spells", "text['spells-level-N'] + spells['slots-N']", "подготовленность не кодируется"],
                ["equipment / features / languages", "text.equipment, text.traits, text.prof", "нет"],
                ["personalityTraits / ideals / bonds / flaws", "text.personality / ideals / bonds / flaws", "нет"],
                ["identity / motivation / conflict / quirk", "text.features", "концепция лежит абзацами в «особенностях»"],
                ["appearance / backstory", "subInfo.skin + background doc", "текст объединяется"],
                ["copper…platinum", "coins.cp/sp/ep/gp/pp", "нет"],
                ["зеркало арены", "data.arena.sheet", "возвращает то, что не влезло в блоки LSS"],
              ].map(([arena, lss, loss]) => (
                <tr key={arena}>
                  <td className="p-3 font-mono text-amber-200">{arena}</td>
                  <td className="p-3 font-mono text-sky-300">{lss}</td>
                  <td className="p-3 text-slate-400">{loss}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}
