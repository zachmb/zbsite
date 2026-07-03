<script lang="ts">
	import type { PageProps } from './$types';
	import RepoCard from './RepoCard.svelte';
	import SiteHeader from '$components/SiteHeader.svelte';
	import SiteFooter from '$components/SiteFooter.svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Work — Zachary Basinger</title>
</svelte:head>

<div class="mx-auto w-full max-w-[640px] px-6">
	<SiteHeader />

	<main>
		<div class="mb-8">
			<h1 class="font-serif text-[2.2rem] leading-tight tracking-[-0.02em]">Work</h1>
			<p class="mt-2 text-[0.9rem] text-muted">
				Things I've built and left in public. Pulled live from
				<a
					href="https://github.com/zachbas"
					target="_blank"
					rel="noopener noreferrer"
					class="link">GitHub</a
				>.
			</p>
		</div>

		{#if data.repos.length}
			<div>
				{#each data.repos as repo}
					<RepoCard repository={repo} />
				{/each}
			</div>
		{:else}
			<p class="border-t border-rule py-8 text-[0.9rem] text-muted">
				Nothing to show right now — take a look on
				<a
					href="https://github.com/zachbas"
					target="_blank"
					rel="noopener noreferrer"
					class="link">GitHub</a
				> instead.
			</p>
		{/if}
	</main>

	<SiteFooter />
</div>
