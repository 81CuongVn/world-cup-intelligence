# Roadmap execution plan

Cycle per item: **Plan → Code+Test → Feedback → Supplement → Deploy → Test+Fix+Redeploy**

| ID | Item | Phase | Status |
|----|------|-------|--------|
| R1 | WebSocket scenario live refresh | 1 | ✅ Done |
| R7 | Group standings API + UI | 1 | ✅ Done |
| R5 | 8 best 3rd → R32 13–16 | 2 | ✅ Done |
| R6 | Bracket visualization UI | 2 | ✅ Done |
| R3 | Squad 23 players/team | 3 | ⚠️ 42 team names (0018) |
| R8 | Historical WC seed 48 teams | 3 | ⚠️ Names done; H2H via StatsBomb |
| R2 | Scenario backtest 2018/2022 | 4 | ✅ Done |
| R4 | Real match data adapter | 4 | ✅ Done |

---

## R1 — WebSocket scenario live refresh

**Plan**
- Hook `useMatchScenarioLive(matchRef, onUpdate)` → `wss://…/api/matches/:ref/live`
- Parse `SCENARIO_UPDATE` → update `scenarioPredictions` state in MatchPage / MatchAnalysisPage
- Fallback: existing REST on mount; WS for push updates
- Vite proxy: `ws: true` for local dev

**Acceptance**
- Panel updates without full page reload when admin triggers scenario recompute
- Connection closes on unmount; no duplicate sockets

---

## R7 — Group standings on web

**Plan**
- `GET /api/tournament/2026/standings` — 12 groups, team names, P/W/D/L/GF/GA/GD/Pts
- `GroupStandingsGrid` on `/matches` + poll 30s
- Reuse `computeGroupStandings` from `tournamentProgression.ts`

---

## R5 — 8 best 3rd place → R32 13–16

**Plan**
- When all 12 groups complete: rank 12 third-place teams (Pts, GD, GF)
- Top 8 → slots on `m-w26-r32-13` … `m-w26-r32-16` (2 per match)
- Constants for slot mapping; tests for ranking + assignment

---

## R6 — Bracket visualization UI

**Plan**
- `GET /api/tournament/2026/bracket` — tree from `match_bracket_links` + match rows + slugs
- `/bracket` page or tab on Matches — R32 → Final, link to match slug

---

## R3 — Squad 23/team

**Plan**
- Migration/script: expand `squads` + `squad_players` for 48 WC 2026 teams (OpenFootball/StatsBomb names)
- Admin verify: `sync-squads` populates upcoming matches

---

## R8 — Historical seed 48 teams

**Plan**
- Replace `team-w26-*` placeholders with real nation rows where possible
- Expand `0013`-style H2H via StatsBomb ingest script for all 48 team IDs

---

## R2 — Scenario backtest

**Plan**
- Implement `runScenarioBacktest`: replay WC 2018/2022 completed matches
- Metrics: Brier, calibration buckets → R2 + `model_runs`
- Admin `POST /api/admin/scenario-backtest`

---

## R4 — Real match data

**Plan**
- `MatchDataProvider` interface; `MockMatchDataProvider` (current) + `FootballDataProvider` stub
- Env `MOCK_SOURCES=false` switches provider; normalize to existing D1 match update path
