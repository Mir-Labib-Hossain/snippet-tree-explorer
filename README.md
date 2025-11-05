# Tree Explorer

Interactive tree inspector with CRUD actions, persistence, undo, and drag-and-drop.

## Quick Summary

- **Framework**: React + `vite` — single-page scope with client-side persistence; `vite` keeps builds fast and avoids routing/SSR overhead from Next JS.
- **Styling**: Used Tailwind to create a neo-brutalism themed ui components with my own creative touch so the app stands out and it's minimalist UI elements gives it a unique look without any third-party UI kits.
- **Live Demo**: _Coming soon_ (will deploy to `vercel`).

## Core Features

- Import JSON via modal; renders as collapsible tree with arrows and selection highlight.
- Breadcrumb tracks exact node path; formatted JSON preview mirrors live state.
- Delete, rename, add nodes (root protected) with confirmation modal for deletions.
- Undo for last action; drag-and-drop re-parenting with drop validation.
- State persists through refresh via `localStorage`.

## Bonus Features

- ✅ Rename on every node including root.
- ✅ Undo last mutation.
- ✅ Drag-and-drop to move nodes.
- ✅ Formatted JSON preview.
- ⏳ Live demo (`vercel`) pending.

## Comparison & Trade-offs

- **`localStorage` vs. Context/Redux**: persistence was mandatory, and the dataset lives in a single tree. Using `localStorage` with local component state keeps the logic minimal while satisfying the refresh requirement, avoiding extra boilerplate from global stores.
- **React + `vite` vs. Next JS**: the app is a single interactive view; `vite` delivers faster dev feedback and smaller bundles without routing or SSR overhead from Next JS.

## Run Locally

```sh
npm install
npm run dev
```

## Docker

```sh
docker build -t tree-explorer .
docker run --rm -p 8080:80 tree-explorer
```

Container serves the `vite` production build from `nginx` on port 80 (mapped above to 8080).
