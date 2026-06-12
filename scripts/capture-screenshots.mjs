import { chromium } from 'playwright';

const url = 'https://wcstat.orangecloud.vn/matches/vong-bang-a-mexico-vs-south-africa';
const outDir = 'docs/screenshots';

const targets = [
  { selector: '#match-stats', file: `${outDir}/02-match-live-stats.png` },
  { selector: '#match-prediction', file: `${outDir}/03-probability-no-tilde.png` },
  { selector: '.panel.hero-glow', file: `${outDir}/04-pitch-map.png` },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(4000);

for (const target of targets) {
  const locator = target.selector
    ? page.locator(target.selector)
    : page.getByRole('heading', { name: target.text }).locator('..');
  await locator.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await locator.first().screenshot({ path: target.file });
  console.log('saved', target.file);
}

await browser.close();
