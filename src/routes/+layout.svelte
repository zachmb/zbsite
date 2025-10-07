<script lang="ts">
	import '../app.css';

	import { page } from '$app/state';
	import { type Snippet, onMount } from 'svelte';
	import { generateRandomSquarePng } from '$utils';
	import { showEasterEgg } from '$lib/stores';

	type Props = { children: Snippet };
	let { children }: Props = $props();

	let iconUrl = $state('');
	onMount(() => {
		iconUrl = generateRandomSquarePng(16);

		Object.defineProperty(window, '__whatCouldThisDo', {
			get: () => ($showEasterEgg = !$showEasterEgg)
		});
	});
</script>

<svelte:head>
	<title>{page.url.pathname}</title>
	<link rel="icon" type="image/png" href={iconUrl} />
</svelte:head>

<svelte:body
	{@attach (body) => {
		if ($showEasterEgg) body.classList.add('minecraft');
		else body.classList.remove('minecraft');
	}}
/>

{@render children()}
