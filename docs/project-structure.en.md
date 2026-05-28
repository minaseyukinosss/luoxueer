# Project Structure

This project uses Next.js App Router with a `src` directory. The structure follows Next.js routing conventions while organizing product code by domain.

## Top-Level Layout

```txt
src/
├── app/        # Next.js App Router files and route handlers
├── features/   # Page/domain-specific product modules
└── shared/     # Cross-feature reusable code
```

## `src/app`

`src/app` is reserved for Next.js convention files:

- `layout.tsx`
- `page.tsx`
- `globals.css`
- `favicon.ico`
- `*/page.tsx`
- `api/*/route.ts`

Route files should stay thin. They should connect a URL to a feature component rather than containing full page implementations.

Example:

```tsx
import MusicPage from "@/features/music/components/MusicPage";

export default function MusicBoxRoute() {
  return <MusicPage />;
}
```

Current routes:

```txt
src/app/
├── page.tsx
├── about/page.tsx
├── musicbox/page.tsx
└── api/
    ├── bilibili/route.ts
    ├── douyin/route.ts
    └── weibo/route.ts
```

## `src/features`

`features` contains code that belongs to one page or product domain.

```txt
src/features/
├── about/
├── home/
└── music/
```

Use a feature folder when code is meaningful only inside that feature.

Feature folder conventions:

- `components/` for feature UI.
- `data/` for feature data, fallback data, and static content.
- `hooks/` for feature hooks.
- `context/` for feature-scoped React Context.
- `constants/` for feature constants.
- `types/` for feature-only types.
- `styles/` for feature-only CSS.

Do not import feature internals from unrelated features unless there is an intentional dependency. If code becomes broadly useful, move it to `src/shared`.

## `src/shared`

`shared` contains code used by multiple features or by the root app shell.

```txt
src/shared/
├── components/
│   ├── icons/
│   ├── layout/
│   ├── providers/
│   ├── transitions/
│   └── ui/
├── lib/
└── styles/
```

Use `shared` for:

- App shell components such as navbar and footer.
- Global providers.
- Base UI primitives.
- Shared icons.
- Common utility functions.
- Cross-feature styles and animations.

Avoid placing route-specific code in `shared`. A file should move here only when reuse is real, or when it belongs to the global app shell.

## Import Rules

Use the `@/*` alias for source imports.

Preferred:

```ts
import { cn } from "@/shared/lib/utils";
import MusicPage from "@/features/music/components/MusicPage";
```

Avoid long relative imports across domains:

```ts
// Avoid
import MusicPage from "../../features/music/components/MusicPage";
```

Relative imports are fine for nearby sibling files inside the same folder.

## Naming Rules

- React component files use PascalCase, for example `MusicPlayerBar.tsx`.
- Hook files use `useXxx.ts`, for example `useAboutData.ts`.
- Non-component TypeScript files use kebab-case or a short semantic name, for example `music-data.ts` and `social-api.ts`.
- Base UI components follow the shadcn style and use lowercase filenames, for example `button.tsx` and `card.tsx`.
- CSS files use kebab-case, for example `home-page.css` and `music-player.css`.
- Next.js convention files keep the official names, for example `page.tsx`, `layout.tsx`, and `route.ts`.
- Filenames should match the default export or module responsibility. Avoid broad names such as `Wrapper` or `Utils` when a clearer name exists.

## Styling Rules

- Global Tailwind, design tokens, and base styles live in `src/app/globals.css`.
- Shared animations live in `src/shared/styles`.
- Feature-only CSS lives inside that feature, for example `src/features/music/styles`.
- Static assets live in `public`.

## Adding New Code

When adding a new page:

1. Create the route entry in `src/app`.
2. Create the implementation under `src/features/<feature-name>`.
3. Keep the route file thin.
4. Move reusable pieces to `src/shared` only when reuse is real.

When adding a shared component:

1. Put primitives in `src/shared/components/ui`.
2. Put shell components in `src/shared/components/layout`.
3. Put providers in `src/shared/components/providers`.
4. Keep feature-specific copy, data, and styles out of shared components.

## Relationship With Next.js Conventions

Next.js defines routing behavior through the `app` directory and special files such as `page.tsx`, `layout.tsx`, and `route.ts`.

`features` and `shared` are not reserved Next.js directory names. They are project-level organization conventions. They live outside `app`, so they do not participate in route generation.
