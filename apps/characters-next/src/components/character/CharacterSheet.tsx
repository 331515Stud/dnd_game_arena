"use client";

import {
  ABILITY_LABELS,
  ARMOR_OPTIONS,
  SKILLS,
  type AbilityKey,
} from "@/data/characterOptions";
import { cn } from "@/lib/cn";
import {
  ABILITY_KEYS,
  abilityMod,
  armorClass,
  finalAbilities,
  proficiencyBonus,
  saveBonus,
  signed,
  skillBonus,
  type CharacterSheetData,
} from "@/lib/character";
import type { PublicCharacter } from "@/lib/serializeCharacter";
import { LssBridge } from "@/components/character/LssBridge";
import {
  ArrowLeftRight,
  Dices,
  Download,
  Flame,
  Heart,
  Loader2,
  Save,
  Shield,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";

interface CharacterSheetProps {
  character: PublicCharacter;
}

type RollResult = { label: string; detail: string; total: number; natural: number };

function rollD20(modifier: number, label: string): RollResult {
  const natural = 1 + Math.floor(Math.random() * 20);
  return {
    label,
    natural,
    total: natural + modifier,
    detail: `к20 (${natural}) ${signed(modifier)}`,
  };
}

export function CharacterSheet({ character }: CharacterSheetProps) {
  const router = useRouter();
  const [name, setName] = useState(character.name);
  const [playerName, setPlayerName] = useState(character.playerName);
  const [alignment, setAlignment] = useState(character.alignment);
  const [level, setLevel] = useState(character.level);
  const [experience, setExperience] = useState(character.experience);
  const [sheet, setSheet] = useState<CharacterSheetData>(character.sheet);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [rolls, setRolls] = useState<RollResult[]>([]);

  const abilities = useMemo(
    () => finalAbilities(sheet.raceId, sheet.baseAbilities, sheet.flexibleBonuses),
    [sheet.raceId, sheet.baseAbilities, sheet.flexibleBonuses],
  );
  const prof = proficiencyBonus(level);
  const ac = armorClass(sheet.armor, abilities, sheet.classId, sheet.shield);
  const initiative = abilityMod(abilities.dex);
  const hpPercent = sheet.hpMax > 0 ? Math.max(0, Math.min(100, (sheet.hpCurrent / sheet.hpMax) * 100)) : 0;

  function patch(partial: Partial<CharacterSheetData>) {
    setSheet((prev) => ({ ...prev, ...partial }));
  }

  function pushRoll(result: RollResult) {
    setRolls((prev) => [result, ...prev].slice(0, 8));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/characters/${character.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          playerName,
          race: character.race,
          subrace: character.subrace,
          className: character.className,
          background: character.background,
          alignment,
          level,
          experience,
          sheet,
        }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        const error = typeof data === "object" && data && "error" in data ? String((data as { error: string }).error) : "Ошибка";
        throw new Error(error);
      }
      setMessage("Лист записан в архив арены.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Удалить лист «${name}»?`)) return;
    await fetch(`/api/characters/${character.id}`, { method: "DELETE" });
    router.push("/characters");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          {sheet.portraitUrl ? (
            <img
              src={sheet.portraitUrl}
              alt={name}
              className="h-24 w-24 rounded-2xl border border-amber-500/30 object-cover shadow-xl"
            />
          ) : (
            <div className="grid h-24 w-24 place-items-center rounded-2xl border border-amber-500/30 bg-amber-500/10 font-fantasy text-3xl text-amber-200">
              {name.slice(0, 1) || "?"}
            </div>
          )}
          <div>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full bg-transparent font-fantasy text-3xl font-black text-white outline-none sm:text-4xl"
            />
            <p className="text-sm text-amber-200">
              {character.race}
              {character.subrace ? ` · ${character.subrace}` : ""} · {character.className} {level} ур.
            </p>
            <p className="text-xs text-slate-400">
              {character.background} · {alignment}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-black text-slate-950"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Сохранить
          </button>
          <a
            href={`/api/characters/${character.id}/export?format=lss`}
            download
            className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-slate-950 px-4 py-2 text-sm font-bold text-amber-200"
            title="Файл в формате longstoryshort.app"
          >
            <Download className="h-4 w-4" /> Экспорт в LSS
          </a>
          <Link
            href="/characters/transfer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300"
          >
            <ArrowLeftRight className="h-4 w-4" /> Мост форматов
          </Link>
          <button
            type="button"
            onClick={() => void remove()}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-800 px-4 py-2 text-sm font-bold text-rose-300"
          >
            <Trash2 className="h-4 w-4" /> Удалить
          </button>
        </div>
      </div>
      {message ? <p className="text-sm text-amber-200">{message}</p> : null}

      <div className="grid gap-4 lg:grid-cols-[220px_1fr_280px]">
        <div className="space-y-3">
          {ABILITY_KEYS.map((key) => {
            const score = abilities[key];
            const mod = abilityMod(score);
            const save = saveBonus(key, abilities, sheet.classId, level);
            return (
              <div key={key} className="rounded-2xl border border-slate-800 bg-slate-900 p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{ABILITY_LABELS[key].full}</p>
                <p className="font-fantasy text-3xl text-amber-200">{score}</p>
                <button
                  type="button"
                  onClick={() => pushRoll(rollD20(mod, ABILITY_LABELS[key].full))}
                  className="mt-1 w-full rounded-lg bg-slate-950 py-1 text-sm font-bold text-white hover:bg-amber-500 hover:text-slate-950"
                >
                  {signed(mod)}
                </button>
                <button
                  type="button"
                  onClick={() => pushRoll(rollD20(save, `Спас. ${ABILITY_LABELS[key].abbr}`))}
                  className="mt-1 text-[11px] text-slate-400 hover:text-amber-300"
                >
                  спас {signed(save)}
                </button>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <CombatStat icon={<Shield className="h-4 w-4" />} label="КД" value={String(ac)} />
            <CombatStat icon={<Sparkles className="h-4 w-4" />} label="Иниц." value={signed(initiative)} onClick={() => pushRoll(rollD20(initiative, "Инициатива"))} />
            <CombatStat icon={<Flame className="h-4 w-4" />} label="Скорость" value={`${sheet.speed} фт.`} />
            <CombatStat icon={<Dices className="h-4 w-4" />} label="Мастерство" value={signed(prof)} />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center gap-2 font-fantasy text-lg text-amber-100">
                <Heart className="h-4 w-4 text-rose-400" /> Хиты
              </p>
              <label className="flex items-center gap-2 text-xs text-slate-400">
                Вдохновение
                <input
                  type="checkbox"
                  checked={sheet.inspiration}
                  onChange={(event) => patch({ inspiration: event.target.checked })}
                />
              </label>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-950">
              <div className="h-full bg-gradient-to-r from-rose-700 to-amber-400 transition-all" style={{ width: `${hpPercent}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <NumberField label="Текущие" value={sheet.hpCurrent} onChange={(value) => patch({ hpCurrent: value })} />
              <NumberField label="Макс." value={sheet.hpMax} onChange={(value) => patch({ hpMax: value })} />
              <NumberField label="Временные" value={sheet.hpTemp} onChange={(value) => patch({ hpTemp: value })} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[-5, -1, 1, 5].map((delta) => (
                <button
                  key={delta}
                  type="button"
                  onClick={() => patch({ hpCurrent: Math.max(0, sheet.hpCurrent + delta) })}
                  className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300"
                >
                  {signed(delta)} ХП
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-slate-400">
              Уровень
              <input
                type="number"
                min={1}
                max={20}
                value={level}
                onChange={(event) => setLevel(Math.min(20, Math.max(1, Number(event.target.value) || 1)))}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="text-xs text-slate-400">
              Опыт
              <input
                type="number"
                min={0}
                value={experience}
                onChange={(event) => setExperience(Math.max(0, Number(event.target.value) || 0))}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="text-xs text-slate-400">
              Игрок
              <input
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="text-xs text-slate-400">
              Мировоззрение
              <input
                value={alignment}
                onChange={(event) => setAlignment(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="text-xs text-slate-400 sm:col-span-2">
              Доспех
              <select
                value={sheet.armor}
                onChange={(event) => patch({ armor: event.target.value as CharacterSheetData["armor"] })}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
              >
                {ARMOR_OPTIONS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="mb-3 font-fantasy text-lg text-amber-100">Атаки</p>
            <div className="space-y-2">
              {sheet.attacks.map((attack, index) => (
                <div key={`${attack.name}-${index}`} className="grid gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 sm:grid-cols-[1fr_auto_1fr_auto]">
                  <span className="font-semibold text-white">{attack.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const bonus = Number(String(attack.bonus).replace("+", "")) || 0;
                      pushRoll(rollD20(bonus, `Атака: ${attack.name}`));
                    }}
                    className="rounded-lg bg-amber-500/20 px-2 py-1 text-xs font-bold text-amber-200"
                  >
                    {attack.bonus}
                  </button>
                  <span className="text-sm text-slate-300">{attack.damage}</span>
                  <span className="text-xs text-slate-500">{attack.notes}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextBlock label="Кто он" value={sheet.identity} onChange={(value) => patch({ identity: value })} />
            <TextBlock label="Мотивация" value={sheet.motivation} onChange={(value) => patch({ motivation: value })} />
            <TextBlock label="Конфликт" value={sheet.conflict} onChange={(value) => patch({ conflict: value })} />
            <TextBlock label="Привычка" value={sheet.quirk} onChange={(value) => patch({ quirk: value })} />
            <TextBlock label="Черта" value={sheet.personalityTraits} onChange={(value) => patch({ personalityTraits: value })} />
            <TextBlock label="Идеал" value={sheet.ideals} onChange={(value) => patch({ ideals: value })} />
            <TextBlock label="Привязанность" value={sheet.bonds} onChange={(value) => patch({ bonds: value })} />
            <TextBlock label="Слабость" value={sheet.flaws} onChange={(value) => patch({ flaws: value })} />
          </div>
          <LssBridge character={character} />
          <TextBlock label="Внешность" value={sheet.appearance} onChange={(value) => patch({ appearance: value })} />
          <TextBlock label="Предыстория" value={sheet.backstory} rows={5} onChange={(value) => patch({ backstory: value })} />
          <TextBlock
            label="Снаряжение"
            value={sheet.equipment.join("\n")}
            rows={6}
            onChange={(value) => patch({ equipment: value.split("\n").map((item) => item.trim()).filter(Boolean) })}
          />
          <TextBlock label="Заметки" value={sheet.notes} rows={4} onChange={(value) => patch({ notes: value })} />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="mb-3 font-fantasy text-lg text-amber-100">Навыки</p>
            <div className="space-y-1">
              {SKILLS.map((skill) => {
                const proficient = sheet.proficientSkills.includes(skill.id);
                const expertise = sheet.expertiseSkills.includes(skill.id);
                const bonus = skillBonus(skill.id, abilities, sheet.proficientSkills, sheet.expertiseSkills, level);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => pushRoll(rollD20(bonus, skill.label))}
                    className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-left text-sm hover:bg-slate-800"
                  >
                    <span className={cn("flex items-center gap-2", proficient ? "text-amber-100" : "text-slate-400")}>
                      <span className={cn("h-2 w-2 rounded-full", expertise ? "bg-amber-400" : proficient ? "bg-emerald-400" : "bg-slate-700")} />
                      {skill.label}
                    </span>
                    <span className="font-mono text-xs text-slate-300">{signed(bonus)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="mb-2 font-fantasy text-lg text-amber-100">Заклинания</p>
            {sheet.spells.length === 0 ? (
              <p className="text-sm text-slate-500">Нет записанных заклинаний.</p>
            ) : (
              <ul className="space-y-1 text-sm text-slate-300">
                {sheet.spells.map((spell) => (
                  <li key={`${spell.name}-${spell.level}`}>
                    <span className="text-amber-300">{spell.level === 0 ? "К" : spell.level}</span> {spell.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="mb-2 font-fantasy text-lg text-amber-100">Черты</p>
            <ul className="list-disc space-y-1 pl-4 text-xs text-slate-300">
              {sheet.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-slate-900 p-4">
            <p className="mb-2 font-fantasy text-lg text-amber-100">Журнал бросков</p>
            {rolls.length === 0 ? (
              <p className="text-sm text-slate-500">Нажмите характеристику, навык или атаку.</p>
            ) : (
              <ul className="space-y-2">
                {rolls.map((roll, index) => (
                  <li key={`${roll.label}-${index}`} className="rounded-xl bg-slate-950/80 px-3 py-2">
                    <p className="text-xs text-slate-400">{roll.label}</p>
                    <p className="font-fantasy text-xl text-white">
                      {roll.total}
                      {roll.natural === 20 ? <span className="ml-2 text-xs text-emerald-400">крит</span> : null}
                      {roll.natural === 1 ? <span className="ml-2 text-xs text-rose-400">провал</span> : null}
                    </p>
                    <p className="text-[11px] text-slate-500">{roll.detail}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CombatStat({
  icon,
  label,
  value,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onClick?: () => void;
}) {
  const className = "rounded-2xl border border-slate-800 bg-slate-900 p-3 text-center";
  const inner = (
    <>
      <p className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider text-slate-500">
        {icon} {label}
      </p>
      <p className="font-fantasy text-2xl text-white">{value}</p>
    </>
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(className, "hover:border-amber-400")}>
        {inner}
      </button>
    );
  }
  return <div className={className}>{inner}</div>;
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="text-xs text-slate-400">
      {label}
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
      />
    </label>
  );
}

function TextBlock({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block text-xs text-slate-400">
      {label}
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-500"
      />
    </label>
  );
}
