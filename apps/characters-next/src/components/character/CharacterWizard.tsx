"use client";

import {
  ALIGNMENTS,
  ARMOR_OPTIONS,
  BACKGROUNDS,
  CLASSES,
  RACES,
  SKILLS,
  SPELLS,
  type AbilityKey,
} from "@/data/characterOptions";
import { cn } from "@/lib/cn";
import {
  ABILITY_KEYS,
  abilityMod,
  armorClass,
  defaultArmorForClass,
  defaultAttacks,
  defaultEquipment,
  defaultSheet,
  emptyAbilities,
  finalAbilities,
  finalizeSheet,
  pointBuySpent,
  proficiencyBonus,
  racialBonuses,
  roll4d6DropLowest,
  signed,
  STANDARD_ARRAY,
  startingHp,
  type CharacterSheetData,
} from "@/lib/character";
import { ABILITY_LABELS } from "@/data/characterOptions";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Loader2,
  RefreshCw,
  Shield,
  User,
  Wand2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: "race", label: "Раса" },
  { id: "class", label: "Класс" },
  { id: "background", label: "Предыстория" },
  { id: "abilities", label: "Характеристики" },
  { id: "skills", label: "Навыки" },
  { id: "story", label: "Личность" },
  { id: "review", label: "Лист" },
] as const;

const NAME_POOL = [
  "Каэла", "Элара", "Мираэн", "Торин", "Гримнар", "Идриль", "Ваэлин", "Сэра",
  "Рорк", "Лира", "Несса", "Бран", "Орин", "Тави", "Фенрик", "Изара",
];
const SURNAME_POOL = [
  "Ночь-Пера", "Пепельная", "Камнестраж", "Ветролап", "Чернильный", "Златокузня",
  "Тихоступ", "Бурелом", "Семимонет", "Лунный Брод", "Красный Плащ", "Искромёт",
];

type AbilityMethod = "array" | "buy" | "roll";

function uniqueSkills(ids: string[]) {
  return Array.from(new Set(ids));
}

function pickRandom<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)] as T;
}

export function CharacterWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [alignment, setAlignment] = useState<(typeof ALIGNMENTS)[number]>("Нейтральный");
  const [sheet, setSheet] = useState<CharacterSheetData>(defaultSheet);
  const [method, setMethod] = useState<AbilityMethod>("array");
  const [rolled, setRolled] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const race = RACES.find((item) => item.id === sheet.raceId) ?? RACES[0];
  const cls = CLASSES.find((item) => item.id === sheet.classId) ?? CLASSES[0];
  const bg = BACKGROUNDS.find((item) => item.id === sheet.backgroundId) ?? BACKGROUNDS[0];
  const abilities = useMemo(
    () => finalAbilities(sheet.raceId, sheet.baseAbilities, sheet.flexibleBonuses),
    [sheet.raceId, sheet.baseAbilities, sheet.flexibleBonuses],
  );
  const racial = racialBonuses(sheet.raceId, sheet.flexibleBonuses);
  const prof = proficiencyBonus(1);
  const hp = startingHp(sheet.classId, abilities.con) + (sheet.raceId === "hill-dwarf" ? 1 : 0);
  const spent = pointBuySpent(sheet.baseAbilities);
  const ac = armorClass(sheet.armor, abilities, sheet.classId, sheet.shield);

  const lockedSkills = bg.skills;
  const extraAny = race.id === "half-elf" ? 2 : 0;
  const classPickTarget = cls.skillChoices;
  const chosenClassSkills = sheet.proficientSkills.filter(
    (id) => !lockedSkills.includes(id) && cls.skillList.includes(id),
  );
  const chosenAnySkills = sheet.proficientSkills.filter(
    (id) => !lockedSkills.includes(id) && !cls.skillList.includes(id),
  );

  const cantripNeed = cls.spellcasting?.cantrips ?? 0;
  const preparedNeed = cls.spellcasting
    ? cls.spellcasting.spellsKnown > 0
      ? cls.spellcasting.spellsKnown
      : Math.max(1, 1 + abilityMod(abilities[cls.spellcasting.ability]))
    : 0;
  const chosenCantrips = sheet.spells.filter((spell) => spell.level === 0);
  const chosenSpells = sheet.spells.filter((spell) => spell.level === 1);

  function patch(partial: Partial<CharacterSheetData>) {
    setSheet((prev) => ({ ...prev, ...partial }));
  }

  function selectRace(id: string) {
    const next = RACES.find((item) => item.id === id);
    if (!next) return;
    patch({
      raceId: id,
      flexibleBonuses: [],
      speed: next.speed,
      languages: next.languages,
    });
  }

  function selectClass(id: string) {
    const next = CLASSES.find((item) => item.id === id);
    if (!next) return;
    const armor = defaultArmorForClass(id);
    patch({
      classId: id,
      armor,
      shield: ["fighter", "paladin", "cleric"].includes(id),
      proficientSkills: uniqueSkills([...bg.skills]),
      expertiseSkills: [],
      spells: [],
      equipment: defaultEquipment(id, sheet.backgroundId),
    });
  }

  function selectBackground(id: string) {
    const next = BACKGROUNDS.find((item) => item.id === id);
    if (!next) return;
    patch({
      backgroundId: id,
      proficientSkills: uniqueSkills([...next.skills]),
      equipment: defaultEquipment(sheet.classId, id),
      personalityTraits: next.description,
    });
  }

  function toggleFlexible(key: AbilityKey) {
    const need = race.flexibleBonuses ?? 0;
    if (!need) return;
    const current = sheet.flexibleBonuses;
    if (current.includes(key)) {
      patch({ flexibleBonuses: current.filter((item) => item !== key) });
      return;
    }
    if (current.length >= need) {
      patch({ flexibleBonuses: [...current.slice(1), key] });
      return;
    }
    patch({ flexibleBonuses: [...current, key] });
  }

  function setAbility(key: AbilityKey, value: number) {
    patch({ baseAbilities: { ...sheet.baseAbilities, [key]: value } });
  }

  function applyStandardArray() {
    const assigned: CharacterSheetData["baseAbilities"] = {
      str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8,
    };
    const order: AbilityKey[] = [...cls.primary, ...ABILITY_KEYS.filter((key) => !cls.primary.includes(key))];
    order.forEach((key, index) => {
      assigned[key] = STANDARD_ARRAY[index] ?? 8;
    });
    patch({ baseAbilities: assigned });
    setMethod("array");
  }

  function rollAbilities() {
    const scores = [0, 1, 2, 3, 4, 5].map(() => roll4d6DropLowest().total);
    setRolled(scores);
    const assigned = emptyAbilities(8);
    const order: AbilityKey[] = [...cls.primary, ...ABILITY_KEYS.filter((key) => !cls.primary.includes(key))];
    const sorted = [...scores].sort((a, b) => b - a);
    order.forEach((key, index) => {
      assigned[key] = sorted[index] ?? 8;
    });
    patch({ baseAbilities: assigned });
    setMethod("roll");
  }

  function toggleSkill(id: string, source: "class" | "any") {
    const locked = lockedSkills.includes(id);
    if (locked) return;
    const has = sheet.proficientSkills.includes(id);
    if (has) {
      patch({
        proficientSkills: sheet.proficientSkills.filter((item) => item !== id),
        expertiseSkills: sheet.expertiseSkills.filter((item) => item !== id),
      });
      return;
    }
    if (source === "class" && chosenClassSkills.length >= classPickTarget) return;
    if (source === "any" && chosenAnySkills.length >= extraAny) return;
    patch({ proficientSkills: uniqueSkills([...sheet.proficientSkills, id]) });
  }

  function toggleSpell(name: string, level: number) {
    const exists = sheet.spells.some((spell) => spell.name === name);
    if (exists) {
      patch({ spells: sheet.spells.filter((spell) => spell.name !== name) });
      return;
    }
    if (level === 0 && chosenCantrips.length >= cantripNeed) return;
    if (level === 1 && chosenSpells.length >= preparedNeed) return;
    patch({ spells: [...sheet.spells, { name, level, prepared: true }] });
  }

  function randomize() {
    const nextRace = pickRandom(RACES);
    const nextClass = pickRandom(CLASSES);
    const nextBg = pickRandom(BACKGROUNDS);
    const assigned: CharacterSheetData["baseAbilities"] = {
      str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8,
    };
    const order: AbilityKey[] = [...nextClass.primary, ...ABILITY_KEYS.filter((key) => !nextClass.primary.includes(key))];
    order.forEach((key, index) => {
      assigned[key] = STANDARD_ARRAY[index] ?? 8;
    });
    const classSkills = [...nextClass.skillList].filter((id) => !nextBg.skills.includes(id));
    const picked: string[] = [];
    while (picked.length < nextClass.skillChoices && classSkills.length) {
      const skill = classSkills.splice(Math.floor(Math.random() * classSkills.length), 1)[0];
      if (skill) picked.push(skill);
    }
    const flex: AbilityKey[] = [];
    if (nextRace.flexibleBonuses) {
      const pool = ABILITY_KEYS.filter((key) => !(key in nextRace.bonuses));
      while (flex.length < nextRace.flexibleBonuses && pool.length) {
        flex.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0] as AbilityKey);
      }
    }
    const cantrips = SPELLS.filter((spell) => spell.level === 0 && spell.classes.includes(nextClass.id));
    const leveled = SPELLS.filter((spell) => spell.level === 1 && spell.classes.includes(nextClass.id));
    const spells = [
      ...cantrips.slice(0, nextClass.spellcasting?.cantrips ?? 0),
      ...leveled.slice(0, nextClass.spellcasting?.spellsKnown || 2),
    ].map((spell) => ({ name: spell.name, level: spell.level, prepared: true }));

    setName(`${pickRandom(NAME_POOL)} ${pickRandom(SURNAME_POOL)}`);
    setAlignment(pickRandom(ALIGNMENTS));
    setMethod("array");
    setSheet(
      finalizeSheet(
        {
          ...defaultSheet(),
          raceId: nextRace.id,
          classId: nextClass.id,
          backgroundId: nextBg.id,
          baseAbilities: assigned,
          flexibleBonuses: flex,
          proficientSkills: uniqueSkills([...nextBg.skills, ...picked]),
          armor: defaultArmorForClass(nextClass.id),
          shield: ["fighter", "paladin", "cleric"].includes(nextClass.id),
          spells,
          identity: nextRace.description,
          motivation: "Найти своё место в большой истории партии.",
          conflict: "Прошлое не отпускает в самый неподходящий момент.",
          quirk: "Всегда проверяет выход из комнаты.",
          personalityTraits: nextBg.description,
          equipment: defaultEquipment(nextClass.id, nextBg.id),
        },
        1,
      ),
    );
  }

  async function save() {
    setSaving(true);
    setError("");
    const heroName = name.trim() || `${pickRandom(NAME_POOL)} ${pickRandom(SURNAME_POOL)}`;
    const abilitiesNow = finalAbilities(sheet.raceId, sheet.baseAbilities, sheet.flexibleBonuses);
    const prepared = finalizeSheet(
      {
        ...sheet,
        hpMax: hp,
        hpCurrent: hp,
        attacks: defaultAttacks(sheet.classId, abilitiesNow, 1),
        equipment: sheet.equipment.length ? sheet.equipment : defaultEquipment(sheet.classId, sheet.backgroundId),
      },
      1,
    );
    try {
      const response = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: heroName,
          playerName,
          race: race.name,
          subrace: race.subname,
          className: cls.name,
          background: bg.name,
          alignment,
          level: 1,
          experience: 0,
          sheet: prepared,
        }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        const message = typeof data === "object" && data && "error" in data ? String((data as { error: string }).error) : "Ошибка сохранения";
        throw new Error(message);
      }
      const id = typeof data === "object" && data && "id" in data ? String((data as { id: string }).id) : "";
      router.push(id ? `/characters/${id}` : "/characters");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
      setSaving(false);
    }
  }

  const canNext = (() => {
    if (step === 0) return Boolean(sheet.raceId) && ((race.flexibleBonuses ?? 0) === 0 || sheet.flexibleBonuses.length === (race.flexibleBonuses ?? 0));
    if (step === 3 && method === "buy") return spent <= 27;
    if (step === 4) return chosenClassSkills.length === classPickTarget && chosenAnySkills.length === extraAny && chosenCantrips.length === cantripNeed && chosenSpells.length === preparedNeed;
    return true;
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
            <Wand2 className="h-3.5 w-3.5" /> Создание персонажа · D&D 5e
          </p>
          <h1 className="font-fantasy text-3xl font-black text-white sm:text-4xl">Лист героя с нуля</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Раса, класс, предыстория, характеристики и навыки — как на нулевой сессии. Готовый лист сохранится в архиве арены.
          </p>
        </div>
        <button
          type="button"
          onClick={randomize}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-slate-900 px-4 py-2.5 text-sm font-bold text-amber-200 transition hover:bg-slate-800"
        >
          <RefreshCw className="h-4 w-4" /> Случайный герой
        </button>
      </div>

      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {STEPS.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setStep(index)}
              className={cn(
                "w-full rounded-xl border px-3 py-2 text-left transition",
                index === step
                  ? "border-amber-400 bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                  : index < step
                    ? "border-amber-500/30 bg-slate-900 text-amber-200"
                    : "border-slate-800 bg-slate-950/60 text-slate-500",
              )}
            >
              <span className="block text-[10px] font-bold uppercase tracking-wider">Шаг {index + 1}</span>
              <span className="font-fantasy text-sm font-bold">{item.label}</span>
            </button>
          </li>
        ))}
      </ol>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl sm:p-7">
        {step === 0 && (
          <div className="space-y-5">
            <header>
              <h2 className="font-fantasy text-2xl text-amber-100">Кровь и происхождение</h2>
              <p className="text-sm text-slate-400">Раса задаёт бонусы характеристик, скорость, зрение и врождённые черты.</p>
            </header>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {RACES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectRace(item.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition",
                    sheet.raceId === item.id
                      ? "border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/40"
                      : "border-slate-800 bg-slate-950/70 hover:border-amber-500/30",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-fantasy text-lg font-bold text-white">{item.name}</p>
                      <p className="text-xs text-amber-300">{item.subname}</p>
                    </div>
                    <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-400">{item.speed} фт.</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.description}</p>
                  <p className="mt-3 text-[11px] font-semibold text-amber-200/90">
                    {Object.entries(item.bonuses)
                      .map(([key, value]) => `${ABILITY_LABELS[key as AbilityKey].abbr} ${signed(value ?? 0)}`)
                      .join(" · ")}
                    {item.flexibleBonuses ? ` · +1 × ${item.flexibleBonuses}` : ""}
                  </p>
                </button>
              ))}
            </div>
            {(race.flexibleBonuses ?? 0) > 0 && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="mb-3 text-sm font-semibold text-amber-200">
                  Распределите {race.flexibleBonuses} бонуса +1
                </p>
                <div className="flex flex-wrap gap-2">
                  {ABILITY_KEYS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleFlexible(key)}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-xs font-bold",
                        sheet.flexibleBonuses.includes(key)
                          ? "border-amber-400 bg-amber-500 text-slate-950"
                          : "border-slate-700 text-slate-300 hover:border-amber-400",
                      )}
                    >
                      {ABILITY_LABELS[key].full}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <header>
              <h2 className="font-fantasy text-2xl text-amber-100">Путь героя</h2>
              <p className="text-sm text-slate-400">Класс определяет кости хитов, спасброски, броню и чем вы занимаетесь в бою.</p>
            </header>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {CLASSES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectClass(item.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition",
                    sheet.classId === item.id
                      ? "border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/40"
                      : "border-slate-800 bg-slate-950/70 hover:border-amber-500/30",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-fantasy text-lg font-bold text-white">{item.name}</p>
                    <span className="text-xs text-slate-400">к{item.hitDie}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.description}</p>
                  <p className="mt-3 text-[11px] text-amber-200">
                    Спасброски: {item.saves.map((key) => ABILITY_LABELS[key].abbr).join(", ")}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <header>
              <h2 className="font-fantasy text-2xl text-amber-100">Откуда вы пришли</h2>
              <p className="text-sm text-slate-400">Предыстория даёт навыки, инструменты, снаряжение и социальную черту.</p>
            </header>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {BACKGROUNDS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectBackground(item.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition",
                    sheet.backgroundId === item.id
                      ? "border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/40"
                      : "border-slate-800 bg-slate-950/70 hover:border-amber-500/30",
                  )}
                >
                  <p className="font-fantasy text-lg font-bold text-white">{item.name}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.description}</p>
                  <p className="mt-3 text-[11px] text-amber-200">
                    {item.skills
                      .map((id) => SKILLS.find((skill) => skill.id === id)?.label)
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-fantasy text-2xl text-amber-100">Шесть столпов</h2>
                <p className="text-sm text-slate-400">Базовые значения до расовых бонусов. Итог считается справа на живую.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {([
                  ["array", "Стандартный набор"],
                  ["buy", "Покупка 27"],
                  ["roll", "4к6"],
                ] as const).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setMethod(id);
                      if (id === "array") applyStandardArray();
                      if (id === "buy") patch({ baseAbilities: emptyAbilities(8) });
                      if (id === "roll") rollAbilities();
                    }}
                    className={cn(
                      "rounded-xl px-3 py-2 text-xs font-bold",
                      method === id ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </header>
            {method === "buy" && (
              <p className={cn("text-sm font-semibold", spent === 27 ? "text-emerald-400" : spent > 27 ? "text-rose-400" : "text-amber-300")}>
                Потрачено очков: {spent} / 27
              </p>
            )}
            {method === "roll" && rolled.length > 0 && (
              <p className="text-sm text-slate-400">
                Броски: {rolled.join(", ")} · лучшие автоматически легли в ключевые характеристики класса.
              </p>
            )}
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {ABILITY_KEYS.map((key) => (
                <div key={key} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-fantasy text-lg text-white">{ABILITY_LABELS[key].full}</p>
                    <span className="text-xs text-slate-500">{ABILITY_LABELS[key].abbr}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      className="h-9 w-9 rounded-lg border border-slate-700 text-lg text-slate-300"
                      onClick={() => setAbility(key, Math.max(8, sheet.baseAbilities[key] - 1))}
                    >
                      −
                    </button>
                    <div className="flex-1 text-center">
                      <p className="font-fantasy text-3xl text-amber-200">{abilities[key]}</p>
                      <p className="text-[11px] text-slate-500">
                        база {sheet.baseAbilities[key]}
                        {racial[key] ? ` ${signed(racial[key])}` : ""} · мод {signed(abilityMod(abilities[key]))}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="h-9 w-9 rounded-lg border border-slate-700 text-lg text-slate-300"
                      onClick={() => setAbility(key, Math.min(method === "buy" ? 15 : 18, sheet.baseAbilities[key] + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <header>
              <h2 className="font-fantasy text-2xl text-amber-100">Чем вы умеете</h2>
              <p className="text-sm text-slate-400">
                Навыки предыстории уже отмечены. Выберите {classPickTarget} навыка класса
                {extraAny ? ` и ещё ${extraAny} любых (полуэльф)` : ""}. Бонус мастерства 1 уровня: {signed(prof)}.
              </p>
            </header>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {SKILLS.map((skill) => {
                const locked = lockedSkills.includes(skill.id);
                const selected = sheet.proficientSkills.includes(skill.id);
                const inClass = cls.skillList.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleSkill(skill.id, inClass || locked ? "class" : "any")}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm",
                      locked
                        ? "border-emerald-700/40 bg-emerald-950/30 text-emerald-100"
                        : selected
                          ? "border-amber-400 bg-amber-500/10 text-amber-100"
                          : "border-slate-800 bg-slate-950/60 text-slate-300",
                    )}
                  >
                    <span>
                      {skill.label}
                      <span className="ml-2 text-[10px] uppercase text-slate-500">{ABILITY_LABELS[skill.ability].abbr}</span>
                    </span>
                    {locked ? <span className="text-[10px] font-bold text-emerald-400">фон</span> : null}
                  </button>
                );
              })}
            </div>
            {cls.id === "rogue" && (
              <div>
                <p className="mb-2 text-sm font-semibold text-amber-200">Компетентность плута — 2 навыка</p>
                <div className="flex flex-wrap gap-2">
                  {sheet.proficientSkills.map((id) => {
                    const skill = SKILLS.find((item) => item.id === id);
                    if (!skill) return null;
                    const on = sheet.expertiseSkills.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          if (on) patch({ expertiseSkills: sheet.expertiseSkills.filter((item) => item !== id) });
                          else if (sheet.expertiseSkills.length < 2) patch({ expertiseSkills: [...sheet.expertiseSkills, id] });
                        }}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-bold",
                          on ? "border-amber-400 bg-amber-500 text-slate-950" : "border-slate-700 text-slate-300",
                        )}
                      >
                        {skill.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {cls.spellcasting && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <p className="mb-2 font-fantasy text-lg text-amber-100">Кантрипы ({chosenCantrips.length}/{cantripNeed})</p>
                  <div className="space-y-2">
                    {SPELLS.filter((spell) => spell.level === 0 && spell.classes.includes(cls.id)).map((spell) => (
                      <button
                        key={spell.id}
                        type="button"
                        onClick={() => toggleSpell(spell.name, 0)}
                        className={cn(
                          "w-full rounded-xl border px-3 py-2 text-left text-sm",
                          chosenCantrips.some((item) => item.name === spell.name)
                            ? "border-amber-400 bg-amber-500/10"
                            : "border-slate-800 bg-slate-950/50",
                        )}
                      >
                        <span className="font-semibold text-white">{spell.name}</span>
                        <span className="block text-xs text-slate-400">{spell.summary}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-fantasy text-lg text-amber-100">
                    Заклинания 1 круга ({chosenSpells.length}/{preparedNeed})
                  </p>
                  <div className="space-y-2">
                    {SPELLS.filter((spell) => spell.level === 1 && spell.classes.includes(cls.id)).map((spell) => (
                      <button
                        key={spell.id}
                        type="button"
                        onClick={() => toggleSpell(spell.name, 1)}
                        className={cn(
                          "w-full rounded-xl border px-3 py-2 text-left text-sm",
                          chosenSpells.some((item) => item.name === spell.name)
                            ? "border-amber-400 bg-amber-500/10"
                            : "border-slate-800 bg-slate-950/50",
                        )}
                      >
                        <span className="font-semibold text-white">{spell.name}</span>
                        <span className="block text-xs text-slate-400">{spell.summary}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div>
              <p className="mb-2 font-fantasy text-lg text-amber-100">Доспех</p>
              <div className="flex flex-wrap gap-2">
                {ARMOR_OPTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => patch({ armor: item.id })}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold",
                      sheet.armor === item.id ? "border-amber-400 bg-amber-500 text-slate-950" : "border-slate-700 text-slate-300",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => patch({ shield: !sheet.shield })}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold",
                    sheet.shield ? "border-amber-400 bg-amber-500 text-slate-950" : "border-slate-700 text-slate-300",
                  )}
                >
                  Щит
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Имя персонажа</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Например, Изара Лунный Брод"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-amber-500"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Игрок</span>
              <input
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="Ваше имя за столом"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-amber-500"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Мировоззрение</span>
              <select
                value={alignment}
                onChange={(event) => setAlignment(event.target.value as (typeof ALIGNMENTS)[number])}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-amber-500"
              >
                {ALIGNMENTS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-400">
                <User className="h-3.5 w-3.5" /> Кто он
              </span>
              <textarea
                rows={2}
                value={sheet.identity}
                onChange={(event) => patch({ identity: event.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-amber-500"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Flame className="h-3.5 w-3.5" /> Мотивация
              </span>
              <textarea
                rows={2}
                value={sheet.motivation}
                onChange={(event) => patch({ motivation: event.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-emerald-500"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-rose-400">Конфликт</span>
              <textarea
                rows={2}
                value={sheet.conflict}
                onChange={(event) => patch({ conflict: event.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-rose-500"
              />
            </label>
            {(
              [
                ["personalityTraits", "Черта характера"],
                ["ideals", "Идеал"],
                ["bonds", "Привязанность"],
                ["flaws", "Слабость"],
                ["quirk", "Привычка"],
                ["appearance", "Внешность"],
                ["backstory", "Предыстория"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="space-y-1 text-sm lg:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
                <textarea
                  rows={key === "backstory" ? 4 : 2}
                  value={sheet[key]}
                  onChange={(event) => patch({ [key]: event.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-amber-500"
                />
              </label>
            ))}
          </div>
        )}

        {step === 6 && (
          <div className="space-y-5">
            <header>
              <h2 className="font-fantasy text-2xl text-amber-100">Готовый лист</h2>
              <p className="text-sm text-slate-400">Проверьте цифры. После сохранения откроется интерактивный чарлист: хиты, броски, атаки.</p>
            </header>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/40 to-slate-950 p-5 lg:col-span-1">
                <p className="font-fantasy text-2xl text-white">{name || "Безымянный герой"}</p>
                <p className="text-sm text-amber-200">
                  {race.name} ({race.subname}) · {cls.name} 1 ур.
                </p>
                <p className="text-xs text-slate-400">
                  {bg.name} · {alignment}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <Stat label="КД" value={String(ac)} hint={sheet.shield ? "со щитом" : "без щита"} />
                  <Stat label="ХП" value={String(hp)} hint={`к${cls.hitDie}+ТЕЛ`} />
                  <Stat label="Бонус" value={signed(prof)} hint="мастерство" />
                </div>
                <div className="mt-4 space-y-1 text-xs text-slate-400">
                  <p>Инициатива {signed(abilityMod(abilities.dex))} · скорость {race.speed} фт.</p>
                  <p>Спасброски класса: {cls.saves.map((key) => ABILITY_LABELS[key].abbr).join(", ")}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 lg:col-span-2">
                {ABILITY_KEYS.map((key) => (
                  <div key={key} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{ABILITY_LABELS[key].abbr}</p>
                    <p className="font-fantasy text-2xl text-amber-200">{abilities[key]}</p>
                    <p className="text-xs text-slate-400">{signed(abilityMod(abilities[key]))}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="mb-2 font-fantasy text-amber-100">Навыки</p>
                <p className="text-sm text-slate-300">
                  {sheet.proficientSkills
                    .map((id) => SKILLS.find((skill) => skill.id === id)?.label)
                    .filter(Boolean)
                    .join(", ") || "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="mb-2 font-fantasy text-amber-100">Заклинания</p>
                <p className="text-sm text-slate-300">
                  {sheet.spells.map((spell) => spell.name).join(", ") || "Нет заклинаний 1 уровня"}
                </p>
              </div>
            </div>
            {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          </div>
        )}
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-bold text-slate-300 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Назад
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            disabled={!canNext}
            onClick={() => setStep((value) => Math.min(STEPS.length - 1, value + 1))}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/20 disabled:opacity-40"
          >
            Далее <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/20 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
            Сохранить лист
          </button>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-slate-950/50 py-2">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="font-fantasy text-xl text-white">{value}</p>
      <p className="text-[10px] text-slate-500">{hint}</p>
    </div>
  );
}


