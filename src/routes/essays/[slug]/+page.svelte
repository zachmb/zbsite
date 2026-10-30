<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	const essay = $derived(data.essay);
	const fmt = (d: string) =>
		new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
</script>

<svelte:head>
	<title>{essay.title} — Zachary Basinger</title>
</svelte:head>

<p class="mb-6 text-sm"><a href="/essays">← Essays</a></p>

<h1 class="mb-1 text-3xl font-bold">{essay.title}</h1>
<p class="mb-6 text-sm">{fmt(essay.date)}{essay.kind !== 'essay' ? ` · ${essay.kind}` : ''}</p>

<div class="max-w-prose leading-relaxed whitespace-pre-wrap">{essay.body}</div>
