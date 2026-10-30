<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import data from '$lib/meditations.json';

	const books = data.books;

	// Which book is open. Initialised from ?book=N on mount so links like
	// /meditations?book=4 (and the home-page quote citations) land correctly.
	let current = $state(1);

	const clamp = (n: number) => Math.min(books.length, Math.max(1, n));

	onMount(() => {
		const q = Number(page.url.searchParams.get('book'));
		if (q) current = clamp(q);
	});

	const book = $derived(books.find((b) => b.number === current) ?? books[0]);

	function open(n: number) {
		current = clamp(n);
		const url = new URL(page.url);
		url.searchParams.set('book', String(current));
		replaceState(url, {});
		if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
	}

	// Back-to-list: return to the book index at the top of the page.
	function backToList() {
		if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>Meditations — Marcus Aurelius</title>
	<meta
		name="description"
		content="Marcus Aurelius' Meditations, the George Long translation, read in full."
	/>
</svelte:head>

<header class="mb-6">
	<h1 class="mb-1 text-3xl font-bold">The Meditations</h1>
	<p class="text-gray-600">
		Marcus Aurelius · translated by {data.translator}
	</p>
</header>

<!-- Book selector -->
<nav aria-label="Books" class="mb-8 border-y border-gray-200 py-3">
	<ol class="flex flex-wrap gap-x-3 gap-y-2">
		{#each books as b}
			<li>
				<button
					type="button"
					onclick={() => open(b.number)}
					class="text-sm {b.number === current
						? 'font-bold text-black'
						: 'text-[var(--link)] hover:underline'}"
					aria-current={b.number === current ? 'true' : undefined}
				>
					{b.number}
				</button>
			</li>
		{/each}
	</ol>
</nav>

<article>
	<h2 class="mb-1 text-2xl font-bold">{book.title}</h2>
	{#if book.dateline}
		<p class="mb-5 text-gray-500 italic">{book.dateline}.</p>
	{:else}
		<div class="mb-5"></div>
	{/if}

	{#each book.sections as s}
		<p class="mb-4"><b>{s.n}.</b> {s.text}</p>
	{/each}
</article>

<!-- Prev / back-to-list / next -->
<nav class="mt-10 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-4">
	<button
		type="button"
		class="border border-gray-400 px-3 py-1 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
		disabled={current === 1}
		onclick={() => open(current - 1)}
	>
		← Previous
	</button>
	<button
		type="button"
		class="border border-gray-400 px-3 py-1 font-bold"
		onclick={backToList}
	>
		Back to list
	</button>
	<button
		type="button"
		class="border border-gray-400 px-3 py-1 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
		disabled={current === books.length}
		onclick={() => open(current + 1)}
	>
		Next →
	</button>
</nav>

<p class="mt-10 text-xs text-gray-400">
	Text: George Long translation, via
	<a href="https://classics.mit.edu/Antoninus/meditations.html" target="_blank" rel="noopener noreferrer"
		>The Internet Classics Archive</a
	>.
</p>
