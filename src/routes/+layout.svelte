<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';

	type Props = { children: Snippet };
	let { children }: Props = $props();
</script>

<svelte:head>
	<title>Zachary Basinger</title>
	<meta
		name="description"
		content="Zachary Basinger — 18, studying Computer Science + Advertising at UIUC. I make things on the internet."
	/>
	<meta name="theme-color" content="#ffffff" />
	<link
		rel="icon"
		href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90' font-family='Georgia,serif'%3EZ%3C/text%3E%3C/svg%3E"
	/>
</svelte:head>

{@render children()}
