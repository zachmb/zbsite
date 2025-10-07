<script lang="ts">
	import type { PageProps } from './$types';
	import RepoCard from './RepoCard.svelte';

	let { data }: PageProps = $props();
</script>

{#each data.repos as repo}
	<RepoCard repository={repo} />
{/each}
