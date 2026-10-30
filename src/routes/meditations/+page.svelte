<script lang="ts">
	import { tick } from 'svelte';
	import { page } from '$app/state';
	import { replaceState, afterNavigate } from '$app/navigation';
	import data from '$lib/meditations.json';

	const books = data.books;

	// Which book is open. Set from ?book=N so links like /meditations?book=4
	// (and the home-page quote citations) land on the right book.
	let current = $state(1);
	// Section to scroll to / briefly highlight on a ?section=N deep link.
	let highlighted = $state(0);

	const clamp = (n: number) => Math.min(books.length, Math.max(1, n));

	// Run after navigation (including the initial load) so our scroll happens
	// AFTER SvelteKit's own scroll-to-top handling, otherwise it gets reset.
	afterNavigate(async () => {
		const q = Number(page.url.searchParams.get('book'));
		if (q) current = clamp(q);

		const sec = Number(page.url.searchParams.get('section'));
		if (!sec) return;

		await tick(); // let the selected book's paragraphs render

		// Don't fight the user: if they start scrolling/touching before our
		// programmatic scroll runs, skip it (prevents the "scroll up yanks me
		// back down" feeling on mobile).
		let aborted = false;
		const cancel = () => (aborted = true);
		addEventListener('wheel', cancel, { once: true, passive: true });
		addEventListener('touchmove', cancel, { once: true, passive: true });

		requestAnimationFrame(() => {
			removeEventListener('wheel', cancel);
			removeEventListener('touchmove', cancel);
			if (aborted) return;
			const el = document.getElementById(`s${sec}`);
			if (!el) return;
			el.scrollIntoView({ block: 'center' });
			highlighted = sec;
			setTimeout(() => (highlighted = 0), 2000);
		});
	});

	const book = $derived(books.find((b) => b.number === current) ?? books[0]);

	function open(n: number) {
		current = clamp(n);
		highlighted = 0;
		const url = new URL(page.url);
		url.searchParams.set('book', String(current));
		url.searchParams.delete('section');
		replaceState(url, {});
		if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
	}

	// Jump to a random book (never the one already open).
	function random() {
		if (books.length < 2) return open(1);
		let n = current;
		while (n === current) n = Math.floor(Math.random() * books.length) + 1;
		open(n);
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

<!-- Book selector + navigation -->
<nav aria-label="Books" class="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-gray-200 py-3">
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

	<div class="flex flex-wrap items-center gap-3">
		<button
			type="button"
			class="border border-gray-400 px-3 py-1 font-bold disabled:cursor-not-allowed disabled:opacity-40"
			disabled={current === 1}
			onclick={() => open(current - 1)}
		>
			← Previous
		</button>
		<button type="button" class="border border-gray-400 px-3 py-1 font-bold" onclick={random}>
			Random
		</button>
		<button
			type="button"
			class="border border-gray-400 px-3 py-1 font-bold disabled:cursor-not-allowed disabled:opacity-40"
			disabled={current === books.length}
			onclick={() => open(current + 1)}
		>
			Next →
		</button>
	</div>
</nav>

<article>
	<h2 class="mb-1 text-2xl font-bold">{book.title}</h2>
	{#if book.dateline}
		<p class="mb-5 text-gray-500 italic">{book.dateline}.</p>
	{:else}
		<div class="mb-5"></div>
	{/if}

	{#each book.sections as s}
		<p
			id="s{s.n}"
			class="mb-4 -mx-2 rounded px-2 transition-colors duration-500 {highlighted === s.n
				? 'bg-gray-100'
				: ''}"
		>
			<b>{s.n}.</b> {s.text}
		</p>
	{/each}
</article>

<p class="mt-10 text-xs text-gray-400">
	Text: George Long translation, via
	<a href="https://classics.mit.edu/Antoninus/meditations.html" target="_blank" rel="noopener noreferrer"
		>The Internet Classics Archive</a
	>.
</p>
