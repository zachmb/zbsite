<script lang="ts">
	import type { PageProps } from './$types';
	import RepoCard from './RepoCard.svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Repos — Zachary Basinger</title>
</svelte:head>

<h1 class="mb-4 text-3xl font-bold">Repos</h1>

<p class="mb-6">
	Things I've built and left in public, pulled live from
	<a href="https://github.com/zachmb" target="_blank" rel="noopener noreferrer">GitHub</a>.
</p>

{#if data.repos.length}
	<ul class="list-disc space-y-2 pl-6">
		{#each data.repos as repo}
			<RepoCard repository={repo} />
		{/each}
	</ul>
{:else}
	<p>
		Nothing to show right now. Take a look on
		<a href="https://github.com/zachmb" target="_blank" rel="noopener noreferrer">GitHub</a> instead.
	</p>
{/if}
