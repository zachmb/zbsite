<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	type Props = { children: Snippet };
	let { children }: Props = $props();

	const nav = [
		{ label: 'Bio', href: '/' },
		{ label: 'Repos', href: '/repos' },
		{ label: 'Essays', href: '/essays' }
	];

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
</script>

<svelte:head>
	<title>Zachary Basinger</title>
	<meta name="description" content="Zachary Basinger" />
</svelte:head>

<div class="mx-auto flex max-w-3xl gap-10 px-6 py-12">
	<nav class="w-24 shrink-0 text-right">
		{#each nav as item}
			<div class="mb-2">
				{#if isActive(item.href)}
					<span class="font-bold text-black">{item.label}</span>
				{:else}
					<a href={item.href}>{item.label}</a>
				{/if}
			</div>
		{/each}
	</nav>

	<main class="min-w-0 flex-1">
		{@render children()}
	</main>
</div>
