<script lang="ts">
	import '../app.css';

	import { page } from '$app/state';
	import { type Snippet, onMount } from 'svelte';
	import { generateRandomSquarePng } from '$utils';

	type Props = { children: Snippet };
	let { children }: Props = $props();

	let iconUrl = $state('');
	onMount(() => (iconUrl = generateRandomSquarePng(16)));
</script>

<svelte:head>
	<title>{page.url.pathname}</title>
	<link rel="icon" type="image/png" href={iconUrl} />
</svelte:head>

{@render children()}
