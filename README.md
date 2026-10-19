# D&D Game Arena

Монорепо с двумя приложениями в папке `apps/`.

## Структура

```
apps/
├── guide-vite/          # Vite + React — Путеводитель D&D 5e + Библиотека Гильдии
│   ├── index.html
│   ├── vite.config.ts
│   ├── public/images/   # Обложки, баннеры, текстуры
│   └── src/
│       ├── App.tsx, main.tsx, index.css
│       ├── components/  # UI компоненты (в т.ч. book/, dice/)
│       ├── content/     # JSON томов и статей (7 книг)
│       ├── data/        # dndData — стадии, навыки, мета, ресурсы
│       ├── library/     # IndexedDB, seed, типы, хуки
│       ├── plates/      # Движок рендера разворотов
│       └── utils/       # cn утилита
│
└── characters-next/     # Next.js (App Router) — Листы персонажей + LSS-мост
    ├── public/
    └── src/
        ├── app/                    # Next.js App Router
        │   ├── layout.tsx          # Шрифт, глобальные стили
        │   ├── page.tsx            # ArenaApp (главная)
        │   ├── globals.css
        │   ├── characters/         # Страницы: список, [id], new, transfer
        │   └── api/                # REST API: characters/*, health
        ├── components/
        │   ├── SiteChrome.tsx      # Шапка/навигация
        │   ├── arena/              # Компоненты ArenaApp (путеводитель встроен)
        │   └── character/          # CharacterSheet, Wizard, Gallery, LSS мост
        ├── content/                # Копия библиотеки томов (используется ArenaApp)
        ├── data/                   # articles.ts, dndData.ts
        ├── db/                     # Плейсхолдер для Drizzle/schema
        └── lib/                    # cn.ts и будущие утилиты
```

## Скрипты запуска

Настройте `package.json` на уровне корня для работы с нужным приложением:

- **Vite-путеводитель** (`apps/guide-vite`): `npm run dev -w apps/guide-vite` / `vite dev`
- **Next.js листы** (`apps/characters-next`): `npm run dev -w apps/characters-next` / `next dev`
