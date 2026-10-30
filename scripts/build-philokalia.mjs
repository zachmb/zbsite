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

// Order the works as they appear in the Philokalia itself (the volume sequence
// from the source's table of contents), not alphabetically. Match each work to
// its slot by prefix (filenames are truncated at 80 chars, so the shorter slug
// is always a prefix of the longer original).
const TOC_ORDER = [
	'isaiah-the-solitary-on-guarding-the-intellect-twenty-seven-texts',
	'evagrios-the-solitary-outline-teaching-on-asceticism-and-stillness-in-the-solitary-life',
	'evagrios-the-solitary-texts-on-discrimination-in-respect-of-passions-and-thoughts',
	'evagrios-the-solitary-extracts-from-the-texts-on-watchfulness',
	'evagrios-the-solitary-on-prayer-one-hundred-and-fifty-three-texts',
	'st-john-cassian-on-the-eight-vices',
	'john-cassian-on-the-holy-fathers-of-sketis-and-discrimination',
	'mark-the-ascetic-on-the-spiritual-law-two-hundred-texts',
	'mark-the-ascetic-on-those-who-think-they-are-made-righteous-by-works-two-hundred-and-twenty-six-texts',
	'mark-the-ascetic-letter-to-nicholas-the-solitary',
	'st-hesychios-the-priest-on-watchfulness-and-holiness',
	'st-neilos-the-ascetic-the-ascetic-discourse',
	'diadochos-of-pontiki-definitions',
	'diadochos-of-pontiki-on-spiritual-knowledge-and-discrimination-one-hundred-texts',
	'john-of-karpathos-for-the-encouragement-of-monks-in-india-who-had-written-him-one-hundred-texts',
	'john-of-karpathos-ascetic-discourse-sent-at-the-request-of-the-same-monks-in-india',
	'anthony-the-great-on-the-character-of-men-and-on-the-virtuous-life-one-hundred-a',
	'theodoros-the-great-ascetic-a-century-of-spiritual-texts',
	'theodoros-the-great-ascetic-theoretikon',
	'st-maximos-the-confessor-four-hundred-texts-on-love',
	'maximus-the-confessor-two-hundred-texts-on-theology-and-the-incarnate-dispensation-of-the-son-of-god',
	'maximus-the-confessor-various-texts-on-theology-the-divine-economy-and-virtue-and-vice',
	'maximus-confessor-on-the-lord-s-prayer-a-short-interpretation-addressed-to-a-dev',
	'thalassios-the-libyan-on-love-self-control-and-life-in-accordance-with-the-intellect',
	'john-of-damaskos-on-the-virtues-and-the-vices',
	'abba-philimon-a-discourse-on-abba-philimon',
	'theognostos-on-the-practice-of-the-virtues-contemplation-and-the-priesthood',
	'philotheos-of-sinai-forty-texts-on-watchfulness',
	'ilias-the-presbyter-a-gnomic-anthology',
	'theophanis-the-monk-the-ladder-of-divine-graces',
	'st-peter-of-damaskos-book-i-a-treasury-of-divine-knowledge',
	'st-symeon-metaphrastis-paraphrase-of-the-homilies-of-st-makarios-of-egypt-i-spir',
	'st-symeon-metaphrastis-paraphrase-of-the-homilies-of-st-makarios-of-egypt-ii-pra',
	'st-symeon-metaphrastis-paraphrase-of-the-homilies-of-st-makarios-of-egypt-iii-pa',
	'st-symeon-metaphrastis-paraphrase-of-the-homilies-of-st-makarios-of-egypt-iv-the-raising-of-the-intellect',
	'st-symeon-metaphrastis-paraphrase-of-the-homilies-of-st-makarios-of-egypt-v-love',
	'st-symeon-metaphrastis-paraphrase-of-the-homilies-of-st-makarios-of-egypt-vi-the',
	'symeon-the-new-theologian-on-faith',
	'symeon-the-new-theologian-one-hundred-and-fifty-three-practical-and-theological-texts',
	'symeon-the-new-theologian-the-three-methods-of-prayer',
	'nikitas-stithatos-on-the-practice-of-the-virtues-one-hundred-texts',
	'nikitas-stithatos-on-the-inner-nature-of-things-and-the-purification-of-the-intellect-one-hundred-texts',
	'nikitas-stithatos-on-spiritual-knowledge-love-and-the-perfection-of-living-one-hundred-texts',
	'theoliptos-metropolitan-of-philadelphia-on-inner-work-in-christ-and-the-monastic-profession',
	'theoliptos-metropolitan-of-philadelphia-texts',
	'nikiphoros-the-monk-on-watchfulness-and-the-guarding-of-the-heart',
	'nikiphoros-the-monk-from-the-life-of-our-holy-father-antony',
	'st-gregory-of-sinai-on-commandments-and-doctrines-warnings-and-promises-on-thoughts-passions-and-virtues-and-also-on-stillness-and-prayer-one-hundred-and-thirty-seven-texts',
	'gregory-of-sinai-further-texts',
	'st-gregory-of-sinai-on-the-signs-of-grace-and-delusion-written-for-the-confessor',
	'gregory-of-sinai-fifteen-texts-h2',
	'st-gregory-of-sinai-on-prayer-seven-texts',
	'gregory-of-sinai-on-stillness-fifteen-texts',
	'st-gregory-palamas-to-the-most-reverend-nun-xenia',
	'gregory-palamas-a-new-testament-decalogue',
	'st-gregory-palamas-in-defense-of-those-who-devoutly-practice-a-life-of-stillness',
	'st-gregory-palamas-three-texts-on-prayer-and-purity-of-heart',
	'st-gregory-palamas-topics-of-natural-and-theological-science-and-on-the-moral-an',
	'gregory-palamas-the-declaration-of-the-holy-mountain-in-defense-of-those-who-dev'
].map((s) => s.replace(/^st-/, ''));
const rankOf = (id) => {
	const b = id.replace(/^st-/, '');
	const i = TOC_ORDER.findIndex((a) => a.startsWith(b) || b.startsWith(a));
	return i === -1 ? TOC_ORDER.length : i;
};
works.sort((a, b) => rankOf(a.id) - rankOf(b.id));

// Emit a small, embeddable index with the most quotable short excerpts.
const cap = (s) => (s.length > EXCERPT_CHARS ? s.slice(0, EXCERPT_CHARS).replace(/\s+\S*$/, '') + '…' : s);

// Score each text so the shown excerpts are the self-contained, aphoristic ones
// (complete, substantial-but-short, not citation-heavy, not mid-argument).
function bestExcerpts(sections, howMany) {
	const scored = sections.map((s) => {
		const first = s.text.split('\n\n')[0].trim();
		const len = first.length;
		let score = 0;
		if (len >= 70 && len <= EXCERPT_CHARS) score += 40; // complete and shows in full
		if (len > EXCERPT_CHARS) score -= Math.min(30, (len - EXCERPT_CHARS) / 12); // would be cut
		if (len < 50) score -= 25; // fragment
		if (/[.!?]["'’”]?$/.test(first)) score += 10; // ends a sentence
		if (/\b(is|are)\b/.test(first.slice(0, 70))) score += 8; // definitional
		if (/^(The|A |He who|Do not|When|Nothing|Prayer|Love|Faith|Humility|Virtue|Stillness|Watchfulness)/.test(first)) score += 8;
		if (/\(cf\.|\d+ ?: ?\d+|\b(Gen|Exod|Lev|Ps|Prov|Isa|Matt|Mark|Luke|John|Acts|Rom|Cor|Gal|Eph|Phil|Col|Tim|Heb)\b/.test(first)) score -= 12; // citation-heavy
		if (/^(For|But|Thus|Therefore|And|So|Hence|Then|Again|Moreover|Now)\b/.test(first)) score -= 8; // mid-argument
		return { n: s.n, text: first, score };
	});
	scored.sort((a, b) => b.score - a.score || a.n - b.n);
	return scored
		.slice(0, howMany)
		.sort((a, b) => a.n - b.n)
		.map((c) => ({ n: c.n, text: cap(c.text) }));
}

const index = {
	title: 'The Philokalia',
	note: 'Selected excerpts from each work, in the order they appear in the Philokalia. Only short passages are shown; the full modern English translation is under copyright.',
	works: works.map((w) => {
		// Show fewer excerpts for shorter works (keep it a modest fraction).
		const howMany = w.sections.length >= 40 ? EXCERPT_TEXTS + 1 : w.sections.length >= 12 ? EXCERPT_TEXTS : 1;
		return {
			id: w.id,
			author: w.author,
			title: w.title,
			count: w.sections.length,
			excerpt: bestExcerpts(w.sections, howMany)
		};
	})
};
await writeFile(outPath, JSON.stringify(index, null, '\t') + '\n', 'utf8');

const totalSections = works.reduce((a, w) => a + w.sections.length, 0);
const bytes = Buffer.byteLength(JSON.stringify(index));
console.log(`Wrote ${outPath} — ${works.length} works (excerpts only), cataloguing ${totalSections} texts, ${(bytes / 1024).toFixed(0)} KB`);
