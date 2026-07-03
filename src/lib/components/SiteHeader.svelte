<script lang="ts">
	import { page } from '$app/state';

	const nav = [
		{ label: 'Writing', href: '/' },
		{ label: 'Work', href: '/work' }
	];

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
</script>

<header class="flex items-baseline justify-between gap-4 pt-8 pb-10">
	<a href="/" class="font-serif text-[1.05rem] tracking-tight text-text hover:opacity-70">
		Zachary Basinger
	</a>

	<nav class="flex items-center gap-4 text-[0.7rem] font-medium tracking-[0.14em] uppercase">
		{#each nav as item}
			<a
				href={item.href}
				class="transition-colors hover:text-text {isActive(item.href)
					? 'text-text'
					: 'text-muted'}"
			>
				{item.label}
			</a>
		{/each}
	</nav>
</header>
