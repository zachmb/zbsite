<script lang="ts">
	import '../app.css';

	import { page } from '$app/state';
	import { type Snippet, onMount } from 'svelte';
	import { generateRandomSquarePng } from '$utils';
	import { showEasterEgg, theme } from '$stores';
	import { systemPrefersDark } from '$stores/media-queries';
	import FontAwesomeHead from '$components/fontawesome/Head.svelte';
	import ThemeSwitcher from '$components/ThemeSwitcher.svelte';

	type Props = { children: Snippet };
	let { children }: Props = $props();

	let iconUrl = $state('');

	let effectiveTheme = $derived(
		$theme === 'auto' ? ($systemPrefersDark ? 'dark' : 'light') : $theme
	);

	onMount(() => {
		iconUrl = generateRandomSquarePng(16);

		Object.defineProperty(window, '__whatCouldThisDo', {
			get: () => showEasterEgg.set(!$showEasterEgg)
		});
	});
</script>

<svelte:head>
	<title>{page.url.pathname}</title>
	<link rel="icon" type="image/png" href={iconUrl} />
</svelte:head>

<FontAwesomeHead />

<svelte:body
	{@attach (body) => {
		if ($showEasterEgg) body.classList.add('minecraft');
		else body.classList.remove('minecraft');

		body.classList.remove('light', 'dark');
		body.classList.add(effectiveTheme);
	}}
/>

<div class="fixed top-4 right-4 z-50">
	<ThemeSwitcher />
</div>

{@render children()}
