# FIFA 2026 Official Match Hub

A Next.js dashboard for the FIFA World Cup 2026 that focuses on official, live FIFA data instead of mock predictions.

The app reads FIFA's public match calendar, standings, match detail, venue, officials, and bracket feeds used by FIFA.com. It is designed as a clean GitHub portfolio project for a real-time sports data interface.

## Features

- Official FIFA World Cup 2026 match schedule
- All 104 match cards with teams, kick-off time, venue, city, score fields, and status
- Match detail pages using FIFA match IDs
- Official group standings with wins, draws, losses, goals, goal difference, and points
- Team pages generated from FIFA team IDs and fixtures
- Knockout bracket view from FIFA's official season bracket feed
- FIFA source page link for verification
- Server-side refresh using Next.js revalidation
- Responsive dashboard UI with Tailwind CSS

## What This Project Does Not Do

This project intentionally does not show:

- Fake match data
- Win probabilities
- AI predictions
- Qualification simulations
- Golden Boot predictions
- Mock player statistics

The goal is to display official FIFA data only.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- React
- Lucide React icons
- FIFA public API endpoints

## Routes

| Route | Description |
| --- | --- |
| `/` | Live home dashboard with official FIFA summary data |
| `/matches` | Full official match schedule |
| `/matches/[matchId]` | Official match detail page |
| `/standings` | Official group standings |
| `/teams` | All teams from FIFA standings feed |
| `/teams/[teamId]` | Team detail and official fixtures |
| `/bracket` | Official knockout bracket |
| `/news` | FIFA source/integration page |
| `/players` | Reserved for official FIFA player stats when available |
| `/predictor` | Disabled because predictions are out of scope |
| `/admin` | Disabled because official data should not be edited locally |

## Data Sources

Primary FIFA page:

```text
https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures
```

FIFA API base used by the app:

```text
https://api.fifa.com/api/v3
```

Important identifiers:

```text
Competition ID: 17
Season ID: 285023
First Stage ID: 289273
```

Core endpoints used:

```text
/calendar/matches?language=en&count=200&idSeason=285023
/calendar/{matchId}?language=en
/calendar/17/285023/289273/standing?language=en&count=200
/seasonbracket/season/285023?language=en
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Start production build:

```bash
npm run start
```

## Project Structure

```text
app/
  matches/
  standings/
  teams/
  bracket/
components/
  app-shell.tsx
  official-match-card.tsx
  ui.tsx
lib/
  fifa.ts
  utils.ts
```

## Official Data Layer

The FIFA integration lives in:

```text
lib/fifa.ts
```

It handles:

- FIFA API requests
- Match sorting
- Match status labels
- Localized text extraction
- Team names and flag URLs
- Standings grouping
- Match date grouping

Data is revalidated every 60 seconds using Next.js server-side fetch caching.

## Notes

FIFA can change endpoint structures, IDs, or response fields. If that happens, update `lib/fifa.ts`.

Player stats are intentionally not mocked. The `/players` page is reserved until official FIFA player-stat data is available through the public feed.
