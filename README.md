# 🚀 Launchpad — A Beginner's Guide to Tech, Engineering & Creative Domains

A friendly, beginner-first knowledge base that maps **16 fields** across software, hardware and
creative tech. For each domain: a plain-language overview, who it's for, a step-by-step learning
roadmap, and hand-picked **free** resources (courses, YouTube channels, docs, communities, project
ideas). Plus a cross-cutting **Start Here** guide on how to choose and where to begin.

Built on the [ButterCMS Vue starter](https://buttercms.com/docs/frameworks/starter-projects/vue)
architecture, with a bundled content snapshot so it always works — and a one-variable switch to a
live ButterCMS account.

## The 16 domains

**Software & Data** — IT foundations · Web development · Data science · AI & machine learning ·
Cybersecurity · Cloud & DevOps
**Hardware & Physical Computing** — IoT · Embedded systems · Electronics & PCB · Robotics ·
Mechanical engineering · CAD/CAM & 3D printing
**Creative & Interactive** — 3D modeling & animation · Design (graphic/UX/UI) · Game development ·
AR/VR/XR

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build
```

## Content

Content lives in `src/content/knowledge-base.json` (the bundled snapshot the site renders by
default). Shape:

```jsonc
{
  "clusters": ["Software & Data", "Hardware & Physical Computing", "Creative & Interactive"],
  "guide":   { "intro": "...", "howToChoose": "...", "starterTracks": [...], ... },
  "domains": [ { "slug": "data-science", "name": "...", "overview": "...", "roadmap": [...], ... } ]
}
```

### Connect a live ButterCMS account (optional)

1. Sign up at [buttercms.com](https://buttercms.com) and copy your **Read API token**.
2. Copy `.env.example` to `.env` and set `VITE_BUTTER_TOKEN`.
3. Model a Collection `domains` and a Page `start-here` (mirror the JSON shape), or run
   `npm run seed:butter` (with a `BUTTER_WRITE_TOKEN`) to generate `butter-import.json` and attempt a push.
4. `npm run build`. The app now reads live from ButterCMS and falls back to the bundled snapshot if
   the API is unreachable. See `src/butter.js`.

## Deploy (Docker / Coolify)

The included `Dockerfile` builds the Vue app and serves the static output with nginx (SPA history
fallback in `nginx.conf`).

```bash
docker build -t launchpad .
docker run -p 8080:80 launchpad   # http://localhost:8080
```

On **Coolify**: create an application from this Git repo, build pack **Dockerfile**, port **80**.

## How the content was made

A multi-agent deep-research pass produced one structured guide per domain; a second pass
fact-checked every resource URL and YouTube channel to drop dead or invented links; a final editor
wrote the Start-Here guide. Resources were auto-verified — but the web moves, so a stale link can
usually be re-found with a quick search of its name.

## Stack

Vue 3 · Vite · Vue Router · ButterCMS SDK · nginx · Coolify
