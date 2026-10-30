<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import Purpose from '$lib/Purpose.svelte';
	import philokalia from '$lib/philokalia.json';
	import pemptousia from '$lib/pemptousia.json';

	const works = philokalia.works;
	let current = $state(0);

	const clamp = (n: number) => Math.min(works.length - 1, Math.max(0, n));

	onMount(() => {
		const q = Number(page.url.searchParams.get('work'));
		if (q) current = clamp(q - 1);
	});

	const work = $derived(works[current]);

	async function open(i: number) {
		current = clamp(i);
		const url = new URL(page.url);
		url.searchParams.set('work', String(current + 1));
		replaceState(url, {});
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
	<p class="text-gray-600">The Philokalia and the living tradition of Mount Athos.</p>
</header>

<Purpose>How to transcend the world.</Purpose>

<h2 class="mb-1 text-2xl font-bold">The Philokalia</h2>
<p class="mb-5 text-sm text-gray-500">{philokalia.note}</p>

<!-- Selected work excerpt -->
<section id="reader" class="mb-6 border-y border-gray-200 py-4">
	<nav class="mb-4 flex flex-wrap items-center gap-3">
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
	</nav>

	<h3 class="text-xl font-bold">{work.title}</h3>
	<p class="mb-4 text-gray-500 italic">{work.author} · {work.count} texts</p>

	{#each work.excerpt as s}
		<p class="mb-4"><b>{s.n}.</b> {s.text}</p>
	{/each}

	<p class="mt-4 text-sm">
		<a href={work.sourceUrl} target="_blank" rel="noopener noreferrer">Read all {work.count} texts at the source →</a>
	</p>
</section>

<!-- Full index -->
<h3 class="mt-8 mb-3 text-lg font-bold">All works</h3>
<ul class="mb-4 list-none space-y-1">
	{#each works as w, i}
		<li>
			<button
				type="button"
				class="text-left {i === current ? 'font-bold text-black' : 'text-[var(--link)] hover:underline'}"
				onclick={() => open(i)}
			>
				{w.author}: {w.title}
			</button>
		</li>
	{/each}
</ul>

<!-- Pemptousia articles -->
<h2 class="mt-12 mb-1 text-2xl font-bold">From Pemptousia</h2>
<p class="mb-5 text-sm text-gray-500">Recent writing on Orthodox theology and spiritual life.</p>

<ul class="list-none space-y-4">
	{#each pemptousia.articles as a}
		<li>
			<a href={a.link} target="_blank" rel="noopener noreferrer" class="font-bold">{a.title}</a>
			<div class="text-xs text-gray-500">{a.date}{a.category ? ` · ${a.category}` : ''}</div>
			{#if a.excerpt}<p class="mt-1 text-sm text-gray-700">{a.excerpt}</p>{/if}
		</li>
	{/each}
</ul>

<p class="mt-10 text-xs text-gray-400">
	Philokalia excerpts via
	<a href="https://orthodoxchurchfathers.com/fathers/philokalia" target="_blank" rel="noopener noreferrer">orthodoxchurchfathers.com</a>.
	Articles via <a href="https://pemptousia.com" target="_blank" rel="noopener noreferrer">pemptousia.com</a>.
</p>
