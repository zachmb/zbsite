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
		{ label: 'Tactics', href: '/tactics' },
		{ label: 'Meditations', href: '/meditations' },
		{ label: 'Orthodoxy', href: '/orthodoxy' }
	];

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
</script>

<svelte:head>
	<meta name="description" content="Zachary Basinger" />
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10 sm:flex-row sm:gap-10 sm:py-12">
	<nav
		class="sticky top-0 z-20 -mx-6 flex flex-wrap gap-x-4 gap-y-1 border-b border-gray-100 bg-white px-6 py-3 shrink-0 sm:static sm:z-auto sm:mx-0 sm:block sm:w-28 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-right"
	>
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
