<script lang="ts">
	const links = [
		{ label: 'Email', href: 'mailto:zachmb2008@gmail.com' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/zacharybas/' },
		{ label: 'GitHub', href: 'https://github.com/zachbas' }
	];
</script>

<footer class="mt-24 border-t border-rule pt-8 pb-16">
	<div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
		<span class="text-[0.8rem] text-muted">Zachary Basinger — Champaign, IL</span>
		<nav class="flex flex-wrap items-center gap-x-2 text-[0.8rem]">
			{#each links as item, i}
				<a
					href={item.href}
					target={item.href.startsWith('http') ? '_blank' : undefined}
					rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
					class="link"
				>
					{item.label}
				</a>
				{#if i < links.length - 1}
					<span class="text-faint">·</span>
				{/if}
			{/each}
		</nav>
	</div>
</footer>
