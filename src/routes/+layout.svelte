<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { type Snippet } from 'svelte';

	type Props = { children: Snippet };
	let { children }: Props = $props();
</script>

<svelte:head>
	<title>{page.url.pathname}</title>
</svelte:head>

{@render children()}
