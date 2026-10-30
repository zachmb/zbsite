<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import Purpose from '$lib/Purpose.svelte';
	import data from '$lib/tactics.json';

	const works = data.works;
	let current = $state(0);

	const clamp = (n: number) => Math.min(works.length - 1, Math.max(0, n));

	onMount(() => {
		const q = Number(page.url.searchParams.get('work'));
		if (q) current = clamp(q - 1);
	});

	const work = $derived(works[current]);

	function open(i: number) {
		current = clamp(i);
		const url = new URL(page.url);
		url.searchParams.set('work', String(current + 1));
		replaceState(url, {});
		if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
	}

	function random() {
		if (works.length < 2) return open(0);
		let n = current;
		while (n === current) n = Math.floor(Math.random() * works.length);
		open(n);
	}
</script>

<svelte:head>
	<title>Tactics — Zachary Basinger</title>
	<meta name="description" content="A field guide to combat-tested leadership: Extreme Ownership and the warrior ethos." />
</svelte:head>

<header class="mb-2">
	<h1 class="mb-1 text-3xl font-bold">Tactics</h1>
	<p class="text-gray-600">Combat-tested leadership, in brief.</p>
</header>

<Purpose>How to act in the world.</Purpose>

<!-- Work selector + navigation -->
<nav aria-label="Works" class="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-gray-200 py-3">
	<ol class="flex flex-wrap gap-x-3 gap-y-2">
		{#each works as w, i}
			<li>
				<button
					type="button"
					onclick={() => open(i)}
					class="text-sm {i === current ? 'font-bold text-black' : 'text-[var(--link)] hover:underline'}"
					aria-current={i === current ? 'true' : undefined}
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

<article>
	<h2 class="mb-1 text-2xl font-bold">{work.title}</h2>
	<p class="mb-5 text-gray-500 italic">{work.author}</p>

	{#each work.sections as s}
		<p class="mb-4"><b>{s.n}.</b> {s.text}</p>
	{/each}

	<p class="mt-8 text-sm">
		<a href={work.sourceUrl} target="_blank" rel="noopener noreferrer">Go to the source →</a>
	</p>
</article>

<p class="mt-10 text-xs text-gray-400">
	Original summaries of the ideas. Read the books (Jocko Willink & Leif Babin) and the SEAL ethos for the real material.
</p>
