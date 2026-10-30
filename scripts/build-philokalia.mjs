// Parses the Philokalia works downloaded from orthodoxchurchfathers.com
// (/fathers/philokalia/<slug>.html) into structured JSON for the /orthodoxy
// reader. Each work becomes { id, author, title, intro[], sections[{n,text}] }.
//
// Download recipe (see conversation): fetch the TOC, curl each work slug into a
// local dir, truncating slugs to 80 chars where the TOC link 404s.
//
// Usage: node scripts/build-philokalia.mjs <dir-of-html> [outfile]
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = process.argv[2] ?? '/tmp/philo';
// The modern English Philokalia translation is under copyright, so we publish
// only a short, attributed opening excerpt of each work plus a link to the full
// text at the source (fair use) — not the complete text.
const outPath = resolve(__dirname, '../src/lib/philokalia.json');
const SOURCE_BASE = 'https://orthodoxchurchfathers.com/fathers/philokalia';
const EXCERPT_TEXTS = 2; // how many opening texts to preview per work
const EXCERPT_CHARS = 320; // cap per previewed text

const NAMED = {
	amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
	mdash: '—', ndash: '–', hellip: '…',
	lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”'
};
const decode = (s) =>
	s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, ent) => {
		if (ent[0] === '#') {
			const code = ent[1] === 'x' || ent[1] === 'X' ? parseInt(ent.slice(2), 16) : parseInt(ent.slice(1), 10);
			return Number.isFinite(code) ? String.fromCodePoint(code) : m;
		}
		return ent in NAMED ? NAMED[ent] : m;
	});

const clean = (frag) => decode(frag.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

function parseWork(htmlText, id) {
	// Work title is the second <h1> ("Author: Title"); first is the site header.
	const h1s = [...htmlText.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => clean(m[1]));
	const titleLine = h1s.find((h) => h && !/Orthodox Church Fathers/i.test(h));
	if (!titleLine) return null;
	const ci = titleLine.indexOf(': ');
	const author = ci > 0 ? titleLine.slice(0, ci).trim() : titleLine.trim();
	// Rejoin split number words from source pagination ("Twenty- Seven" -> "Twenty-Seven").
	const title = (ci > 0 ? titleLine.slice(ci + 2) : titleLine).replace(/([A-Za-z])- ([A-Za-z])/g, '$1-$2').trim();

	// Scan <h2> and <p> in document order. <h2> headings mark parts: "centuries"
	// (First/Second Century, etc.) restart numbering at 1, and prologue/foreword
	// headings introduce intro prose. Each <p> starting "N. " is a numbered text.
	// Headings are sometimes wrapped as <p><h2>Second Century</h2></p>, so the
	// outer <p> match would swallow them. Detect a nested <h2> and treat the
	// token as a heading in that case.
	const tokens = [...htmlText.matchAll(/<(h2|p)[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => {
		const nested = m[2].match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
		return nested ? { tag: 'h2', text: clean(nested[1]) } : { tag: m[1], text: clean(m[2]) };
	});

	const intro = [];
	const sections = [];
	let lastN = 0;
	let pendingLabel = null; // part label to attach to the next section
	let forceNewPart = false;

	const isBoilerplate = (t) => !t || /^(content|orthodox church fathers)/i.test(t) || /^[⬅⬆⮕\s«»<>]+$/.test(t);
	const isIntroHeading = (t) => /^(prologue|foreword|introduction|preface|note)\b/i.test(t);

	for (const tok of tokens) {
		if (tok.tag === 'h2') {
			if (isBoilerplate(tok.text)) {
				lastN = 0;
			} else if (isIntroHeading(tok.text)) {
				pendingLabel = null;
				forceNewPart = false;
				lastN = 0;
			} else {
				pendingLabel = tok.text; // e.g. "First Century"
				forceNewPart = true;
				lastN = 0;
			}
			continue;
		}
		const p = tok.text;
		if (!p || /Orthodox Church Fathers/i.test(p)) continue;
		const m = p.match(/^(\d+)\.\s+([\s\S]+)$/);
		// New section only on a strictly-increasing leading number (resets at each
		// part). This ignores stray mid-text numerals that would split a section.
		if (m && Number(m[1]) > lastN) {
			lastN = Number(m[1]);
			const sec = { n: lastN, text: m[2].trim() };
			if (forceNewPart) {
				sec.part = pendingLabel;
				forceNewPart = false;
				pendingLabel = null;
			}
			sections.push(sec);
		} else if (sections.length === 0) {
			intro.push(p);
		} else {
			sections[sections.length - 1].text += '\n\n' + p; // multi-paragraph section
		}
	}

	// Non-numbered work: number the (intro) content paragraphs sequentially.
	if (sections.length === 0) {
		intro.forEach((p, i) => sections.push({ n: i + 1, text: p }));
		intro.length = 0;
	}

	return { id, author, title, intro, sections };
}

const files = (await readdir(srcDir)).filter((f) => f.endsWith('.html'));
let works = [];
for (const f of files) {
	const text = await readFile(join(srcDir, f), 'utf8');
	const w = parseWork(text, f.replace(/\.html$/, ''));
	if (!w || !w.sections.length) continue;
	// Drop redirect/error pages that slipped through.
	if (/^(moved permanently|not found|301|302)$/i.test(w.author) || /moved permanently/i.test(w.title)) continue;
	works.push(w);
}

// De-duplicate works that differ only by a "St "/"Saint " prefix or punctuation
// (the site hosts both /slug and /st-slug). Key on alphanumerics of author+title
// with any leading Saint stripped. Keep the copy with more sections; on a tie,
// prefer the cleaner author/title split (shorter author string).
const key = (w) =>
	(w.author.replace(/^(st\.?|saint)\s+/i, '') + w.title)
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '');
const byKey = new Map();
for (const w of works) {
	const k = key(w);
	const prev = byKey.get(k);
	if (!prev) byKey.set(k, w);
	else if (w.sections.length > prev.sections.length) byKey.set(k, w);
	else if (w.sections.length === prev.sections.length && w.author.length < prev.author.length) byKey.set(k, w);
}
works = [...byKey.values()];

// Normalise the display author (drop a leading "St"/"Saint" for consistency,
// since the collection mixes both forms for the same writer).
for (const w of works) w.author = w.author.replace(/^(st\.?|saint)\s+/i, '').trim();

// Stable order: by author, then title.
works.sort((a, b) => a.author.localeCompare(b.author) || a.title.localeCompare(b.title));

// Emit a small, embeddable index with a short opening excerpt + source link.
const cap = (s) => (s.length > EXCERPT_CHARS ? s.slice(0, EXCERPT_CHARS).replace(/\s+\S*$/, '') + '…' : s);
const index = {
	title: 'The Philokalia',
	note: 'Excerpts shown for study; the modern English translation is under copyright. Follow the link to read each work in full.',
	works: works.map((w) => ({
		id: w.id,
		author: w.author,
		title: w.title,
		count: w.sections.length,
		sourceUrl: `${SOURCE_BASE}/${w.id}.html`,
		excerpt: w.sections.slice(0, EXCERPT_TEXTS).map((s) => ({ n: s.n, text: cap(s.text.split('\n\n')[0]) }))
	}))
};
await writeFile(outPath, JSON.stringify(index, null, '\t') + '\n', 'utf8');

const totalSections = works.reduce((a, w) => a + w.sections.length, 0);
const bytes = Buffer.byteLength(JSON.stringify(index));
console.log(`Wrote ${outPath} — ${works.length} works (excerpts only), cataloguing ${totalSections} texts, ${(bytes / 1024).toFixed(0)} KB`);
