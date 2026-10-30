<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	type Props = { children: Snippet };
	let { children }: Props = $props();

	const nav = [
		{ label: 'Bio', href: '/' },
		{ label: 'Repos', href: '/repos' },
		{ label: 'Essays', href: '/essays' },
		{ label: 'Meditations', href: '/meditations' }
	];

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
</script>

<svelte:head>
	<meta name="description" content="Zachary Basinger" />
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10 sm:flex-row sm:gap-10 sm:py-12">
	<nav class="flex flex-wrap gap-x-4 gap-y-1 shrink-0 sm:block sm:w-28 sm:text-right">
		{#each nav as item}
			<div class="sm:mb-2">
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
