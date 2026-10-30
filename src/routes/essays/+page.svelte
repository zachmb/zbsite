<script lang="ts">
	import data from '$lib/essays.json';

	// newest first
	const essays = [...data.essays].sort((a, b) => b.date.localeCompare(a.date));
	const fmt = (d: string) =>
		new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
</script>

<svelte:head>
	<title>Essays — Zachary Basinger</title>
</svelte:head>

<h1 class="mb-4 text-3xl font-bold">Essays</h1>

<p class="mb-5">Some older writing, mostly from before I wrote much code.</p>

<ul class="list-disc space-y-2 pl-6">
	{#each essays as e}
		<li>
			<a href="/essays/{e.slug}">{e.title}</a>
			<span class="text-sm">· {fmt(e.date)}{e.kind === 'poem' ? ' · poem' : ''}</span>
		</li>
	{/each}
	<li>
		You're not an entrepreneur if you ChatGPT'd a website
		<span class="text-sm italic">(in progress)</span>
	</li>
</ul>
