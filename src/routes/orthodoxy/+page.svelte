<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import Purpose from '$lib/Purpose.svelte';
	import philokalia from '$lib/philokalia.json';
	import pemptousia from '$lib/pemptousia.json';
	import editorial from '$lib/philokalia-editorial.json';

	const works = philokalia.works;
	let current = $state(0);

	type Bio = { text: string; url: string };
	const bioFor = (author: string): Bio =>
		(editorial.authors as Record<string, Bio>)[author] ?? { text: '', url: '' };

	// Theme groupings (resolved to work indices) for "Browse by theme".
	const themeGroups = editorial.themes.map((t) => ({
		name: t.name,
		items: t.workIds
			.map((id) => works.findIndex((w) => w.id === id))
			.filter((i) => i >= 0)
			.map((i) => ({ i, title: works[i].title, author: works[i].author }))
	}));

	const clamp = (n: number) => Math.min(works.length - 1, Math.max(0, n));

	// Group works by author for an easy-to-scan index.
	const groups: { author: string; items: { title: string; count: number; i: number }[] }[] = [];
	works.forEach((w, i) => {
		let g = groups.find((x) => x.author === w.author);
		if (!g) {
			g = { author: w.author, items: [] };
			groups.push(g);
		}
		g.items.push({ title: w.title, count: w.count, i });
	});

	// Pool of all the short excerpts, for the "random quote" feature.
	const quotePool = works.flatMap((w, i) =>
		w.excerpt.map((e) => ({ text: e.text, n: e.n, author: w.author, title: w.title, i }))
	);
	let quote = $state(quotePool[0]);

	onMount(() => {
		const q = Number(page.url.searchParams.get('work'));
		if (q) current = clamp(q - 1);
		randomQuote(); // show a fresh passage on load
	});

	// Surface a different random passage from across the Philokalia.
	function randomQuote() {
		if (quotePool.length < 2) return;
		let q = quote;
		while (q === quote) q = quotePool[Math.floor(Math.random() * quotePool.length)];
		quote = q;
	}

	const work = $derived(works[current]);

	// scrollToReader is used when picking a work from the index further down the
	// page (so the excerpt comes into view). The numbered selector and
	// Prev/Random/Next sit right above the reader, so they update in place.
	async function open(i: number, scrollToReader = false) {
		current = clamp(i);
		const url = new URL(page.url);
		url.searchParams.set('work', String(current + 1));
		replaceState(url, {});
		if (!scrollToReader) return;
		await tick();
		document.getElementById('reader')?.scrollIntoView({ block: 'start' });
	}

	function random() {
		if (works.length < 2) return open(0);
		let n = current;
		while (n === current) n = Math.floor(Math.random() * works.length);
		open(n);
	}
</script>

<svelte:head>
	<title>Orthodoxy — Zachary Basinger</title>
	<meta name="description" content="The Philokalia and the Orthodox spiritual tradition: excerpts and writings." />
</svelte:head>

<header class="mb-2">
	<h1 class="mb-1 text-3xl font-bold">Orthodoxy</h1>
	<p class="text-[#111]">The Philokalia and the living tradition of Mount Athos.</p>
</header>

<Purpose>How to transcend the world.</Purpose>

<h2 class="mb-1 text-2xl font-bold">The Philokalia</h2>
<p class="mb-3">
	{editorial.philokaliaIntro.text}
	{#if editorial.philokaliaIntro.url}<a
			href={editorial.philokaliaIntro.url}
			target="_blank"
			rel="noopener noreferrer"
			class="text-sm whitespace-nowrap">More ↗</a
		>{/if}
</p>
<p class="mb-5 text-sm text-[#111]">{philokalia.note}</p>

<!-- A random passage from across the Philokalia -->
<figure class="mb-8 border-l-2 border-gray-300 pl-4">
	<blockquote class="text-[#111] italic">&ldquo;{quote.text}&rdquo;</blockquote>
	<figcaption class="mt-2 text-sm text-[#111] not-italic">
		<button
			type="button"
			class="text-left text-[var(--link)] hover:underline"
			onclick={() => open(quote.i, true)}>{quote.author}, {quote.title}</button
		>
		<button
			type="button"
			onclick={randomQuote}
			class="ml-1 text-[var(--link)] hover:underline"
			aria-label="Another random passage"
			title="Another passage">↻</button
		>
	</figcaption>
</figure>

<!-- Work selector (numbered) + navigation -->
<nav aria-label="Works" class="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-gray-200 py-3">
	<ol class="flex flex-wrap gap-x-3 gap-y-2">
		{#each works as w, i}
			<li>
				<button
					type="button"
					onclick={() => open(i)}
					class="text-sm {i === current ? 'font-bold text-black' : 'text-[var(--link)] hover:underline'}"
					aria-current={i === current ? 'true' : undefined}
					title="{w.author}: {w.title}"
				>
					{i + 1}
				</button>
			</li>
		{/each}
	</ol>

	<div class="flex flex-wrap items-center gap-3">
		<button
			type="button"
			class="border border-gray-400 px-3 py-1 font-bold disabled:cursor-not-allowed disabled:opacity-40"
			disabled={current === 0}
			onclick={() => open(current - 1)}
		>
			← Previous
		</button>
		<button type="button" class="border border-gray-400 px-3 py-1 font-bold" onclick={random}>Random</button>
		<button
			type="button"
			class="border border-gray-400 px-3 py-1 font-bold disabled:cursor-not-allowed disabled:opacity-40"
			disabled={current === works.length - 1}
			onclick={() => open(current + 1)}
		>
			Next →
		</button>
	</div>
</nav>

<!-- Selected work excerpt -->
<article id="reader">
	<h3 class="text-xl font-bold">{work.title}</h3>
	<p class="mb-2 text-[#111] italic">{work.author} · {work.count} texts · {current + 1} of {works.length}</p>

	{#if bioFor(work.author).text}
		<p class="mb-4 text-sm text-[#111]">
			{bioFor(work.author).text}
			{#if bioFor(work.author).url}<a
					href={bioFor(work.author).url}
					target="_blank"
					rel="noopener noreferrer"
					class="whitespace-nowrap">Wikipedia ↗</a
				>{/if}
		</p>
	{/if}

	{#each work.excerpt as s}
		<p class="mb-4"><b>{s.n}.</b> {s.text}</p>
	{/each}

	<p class="mt-4 text-sm text-[#111]">Selected from {work.count} texts.</p>
</article>

<!-- Index, grouped by author -->
<h3 class="mt-10 mb-3 text-lg font-bold">Browse by author</h3>
<div class="mb-4 space-y-4">
	{#each groups as g}
		<div>
			<div class="font-bold">{g.author}</div>
			{#if bioFor(g.author).text}
				<p class="mb-1 text-sm text-[#111]">
					{bioFor(g.author).text}
					{#if bioFor(g.author).url}<a
							href={bioFor(g.author).url}
							target="_blank"
							rel="noopener noreferrer"
							class="whitespace-nowrap">Wikipedia ↗</a
						>{/if}
				</p>
			{/if}
			<ul class="list-none space-y-1 pl-4">
				{#each g.items as it}
					<li>
						<button
							type="button"
							class="text-left {it.i === current ? 'font-bold text-black' : 'text-[var(--link)] hover:underline'}"
							onclick={() => open(it.i, true)}
						>
							{it.i + 1}. {it.title}
						</button>
						<span class="text-sm text-[#111]">· {it.count}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>

<!-- Index, grouped by theme -->
<h3 class="mt-10 mb-3 text-lg font-bold">Browse by theme</h3>
<div class="mb-4 space-y-4">
	{#each themeGroups as t}
		<div>
			<div class="font-bold">{t.name}</div>
			<ul class="list-none space-y-1 pl-4">
				{#each t.items as it}
					<li>
						<button
							type="button"
							class="text-left {it.i === current
								? 'font-bold text-black'
								: 'text-[var(--link)] hover:underline'}"
							onclick={() => open(it.i, true)}
						>
							{it.title}
						</button>
						<span class="text-sm text-[#111]">· {it.author}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>

<!-- Pemptousia articles -->
<h2 class="mt-12 mb-1 text-2xl font-bold">From Pemptousia</h2>
<p class="mb-5 text-sm text-[#111]">Recent writing on Orthodox theology and spiritual life.</p>

<ul class="list-none space-y-4">
	{#each pemptousia.articles as a}
		<li>
			<a href={a.link} target="_blank" rel="noopener noreferrer" class="font-bold">{a.title}</a>
			<div class="text-xs text-[#111]">{a.date}{a.category ? ` · ${a.category}` : ''}</div>
			{#if a.excerpt}<p class="mt-1 text-sm text-[#111]">{a.excerpt}</p>{/if}
		</li>
	{/each}
</ul>

<p class="mt-10 text-xs text-[#111]">
	Philokalia excerpts via
	<a href="https://orthodoxchurchfathers.com/fathers/philokalia" target="_blank" rel="noopener noreferrer">orthodoxchurchfathers.com</a>.
	Articles via <a href="https://pemptousia.com" target="_blank" rel="noopener noreferrer">pemptousia.com</a>.
	Overview and author notes from
	<a href="https://en.wikipedia.org/wiki/Philokalia" target="_blank" rel="noopener noreferrer">Wikipedia</a>
	(CC BY-SA).
</p>
