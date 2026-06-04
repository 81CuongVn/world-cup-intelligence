# World Cup Intelligence (PitchIntel)

**PitchIntel** — nền tảng phân tích chiến thuật & xác suất cho **FIFA World Cup 2026**, chạy trên Cloudflare Workers.

🌐 **Production:** [wc-tactical-probability-platform.sycu-lee.workers.dev](https://wc-tactical-probability-platform.sycu-lee.workers.dev)

---

## Tính năng chính

### Trang chủ (`/`)
- Trận nổi bật (featured match) + xác suất real-time
- Lịch thi đấu rút gọn, tin nóng, snapshot giải (scheduled / live / completed)
- Song ngữ **Tiếng Việt / English** (toàn site)

### Trận đấu (`/matches`)
- Lịch đầy đủ **104 trận** WC 2026 (vòng bảng + knockout)
- Tỉ số **LIVE** và **FT** trên lịch, làm mới mỗi 30 giây
- Lọc: tất cả / vòng bảng / knockout

### Pipeline sau trận (backend)
Sau mỗi trận kết thúc (cron mỗi phút):
1. Cập nhật tỉ số & `status = completed` trên D1
2. **Tiến vòng knockout** — đội thắng vào R16 → Tứ kết → Bán kết → Chung kết / tranh hạng 3
3. **Xếp hạng bảng** — khi hết 6 trận/bảng, top 2 vào Vòng 1/16 (bảng A–L)
4. **Tính lại xác suất** toàn bộ 104 trận (`recomputeAllWc2026Matches`)

> Hiện dùng mock ingest (tỉ số theo thời gian kickoff). Sẵn sàng thay bằng API dữ liệu thật trong `src/ingestion/matchDataRefresh.ts`.

### Chi tiết trận (`/matches/:matchId`)
- Xác suất thắng / hòa / thua, phân bố tỉ số, khoảng thời gian ghi bàn
- Team system, kịch bản (scenarios), model vs market
- Lịch sử đối đầu, preview AI, tactical briefing
- Phân tích sâu: `/matches/:matchId/analysis`

### Bài viết / News Intelligence (`/news-intelligence`)
- RSS từ **BBC**, **The Guardian**, **FIFA** (crawl mỗi 15 phút)
- Danh sách tin + thẻ nóng
- **Mỗi bài một trang riêng** (`/news-intelligence/:articleId`)
- Nút **Tiếng Việt | English** trên từng bài (dịch AI lần đầu, lưu D1)
- Link *Đọc chi tiết tại nguồn* mở bài gốc

### Hướng dẫn (`/guide`)
- Giải thích cách đọc xác suất, kịch bản, disclaimer thị trường

### Đội / Cầu thủ
- `/teams/:teamId` — đội hình, phong độ
- `/players/:playerId` — thông tin cầu thủ
- `/lineups/:matchId` — đội hình trận

---

## Nguyên tắc thiết kế

| Lớp | Vai trò |
|-----|---------|
| **Data Truth** | D1, R2 raw, provenance nguồn |
| **Probability** | Engine Poisson/Dixon-Coles — số liệu do engine, không do AI |
| **Intelligence** | Cloudflare AI Gateway + OpenAI — chỉ giải thích / tóm tắt |

---

## Kiến trúc

```
Cron (* * * * *) ──► INGEST_QUEUE ──► matchDataRefresh
                                      ├── live tick + FT
                                      └── tournamentProgression
                                              └── bulk recompute (104 trận)

Cron (*/15 * * * *) ──► crawl_news ──► RSS ──► D1 + dịch VI

React SPA (Vite) ──► Hono API on Workers ──► D1 / KV / R2 / Queues / AI
```

**Stack:** Cloudflare Workers, D1, KV, R2, Queues, Durable Objects, Workers AI, Vite + React 19, Tailwind, Hono, TypeScript.

---

## Quick start

```bash
git clone https://github.com/sycu8/world-cup-intelligence.git
cd world-cup-intelligence
npm install
npm run db:migrate:local
npm run seed
npm test
npm run dev
```

Worker + D1 local:

```bash
npx wrangler dev
```

---

## Scripts

| Script | Mô tả |
|--------|--------|
| `npm run dev` | Frontend Vite |
| `npm run build` | Build production |
| `npm run test` | Vitest (39 tests) |
| `npm run typecheck` | TypeScript |
| `npm run deploy` | Build + `wrangler deploy` |
| `npm run db:migrate:local` | Migration D1 local |
| `npm run db:migrate:remote` | Migration D1 production |

---

## Cấu hình Cloudflare

1. Tạo D1, R2, KV, Queues (xem `wrangler.jsonc`)
2. Apply migrations: `npm run db:migrate:remote`
3. Secrets:

```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put ADMIN_TOKEN   # optional, cho /api/admin
```

4. Deploy: `npm run deploy`

Chi tiết AI Gateway: xem [BRANDING.md](./BRANDING.md).

---

## API (public)

| Endpoint | Mô tả |
|----------|--------|
| `GET /api/health` | Health + meta refresh |
| `GET /api/dashboard` | Featured match, counts |
| `GET /api/schedule` | Lịch 104 trận theo ngày |
| `GET /api/matches/:id` | Chi tiết trận |
| `GET /api/matches/:id/probability` | Snapshot xác suất |
| `GET /api/matches/:id/tactical-briefing` | Briefing AI |
| `GET /api/matches/:id/scenarios` | Kịch bản |
| `GET /api/news` | Danh sách tin (paginate, hot) |
| `GET /api/news/:docId` | Một bài (+ dịch VI on-demand) |
| `GET /api/analysis/:matchId` | Phân tích đa biến |

Admin (cần `X-Admin-Token`): `POST /api/admin/recompute-all`, `POST /api/admin/recompute/:matchId`, …

---

## Kiểm tra chất lượng

```bash
npm run typecheck   # ✓ pass
npm test            # ✓ 39 tests, 14 files
```

**Đã kiểm tra:**
- Xác suất & snapshot engine
- Dịch tin tức (VI detection, backfill)
- RSS images & publishers
- Post-match lifecycle & xếp hạng bảng
- Market calculations, scoreline, safety copy

---

## Cấu trúc thư mục

```
app/           React UI (pages, components, i18n)
src/
  routes/      Hono API
  services/    recompute, progression, translation
  ingestion/   match refresh, news crawler
  models/      probability engine
  queues/      ingest + model consumers
  scheduled/   cron
migrations/    D1 SQL (0001–0012)
tests/         Vitest
```

---

## Dữ liệu & pháp lý

- Không scrape nguồn không kiểm soát
- Chỉ RSS/API có giấy phép hoặc open data
- Raw payload lưu R2 trước khi normalize D1
- Ghi chú license trong `source_registry`

---

## Roadmap

- [ ] API dữ liệu trận thật (FIFA / partner feed) thay mock ingest
- [ ] 8 suất hạng 3 tốt nhất → R32 trận 13–16
- [ ] Bracket visualization UI
- [ ] Bảng xếp hạng vòng bảng trên web

---

## License

MIT — xem repository owner để biết chi tiết.

## Liên hệ

Repository: [github.com/sycu8/world-cup-intelligence](https://github.com/sycu8/world-cup-intelligence)
