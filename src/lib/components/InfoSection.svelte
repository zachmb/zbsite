<script lang="ts">
	let nav = [
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/zacharybas/', external: true },
		{ label: 'Email', href: 'mailto:zachmb2008@gmail.com', external: false }
	];

	let uiuc =
		'https://publish.illinois.edu/illinoisadvertising/computer-science-advertising-illinois/';
</script>

<section class="px-6 py-24 md:py-32">
	<div class="space-grotesk-400 mx-auto flex max-w-xl flex-col gap-10 text-text">
		<!-- nav row -->
		<nav class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm opacity-80">
			{#each nav as item, i}
				<a
					href={item.href}
					target={item.external ? '_blank' : undefined}
					rel={item.external ? 'noopener noreferrer' : undefined}
					class="text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
				>
					{item.label}
				</a>
				{#if i < nav.length - 1}
					<span class="opacity-40">·</span>
				{/if}
			{/each}
		</nav>

		<!-- name -->
		<h2 class="space-grotesk-600 text-3xl md:text-4xl">Zachary Basinger</h2>

		<!-- bio -->
		<div class="flex flex-col gap-6 text-base leading-relaxed md:text-lg">
			<p>
				I'm 18, studying Computer Science + Advertising at the
				<a
					href={uiuc}
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
					>University of Illinois Urbana-Champaign</a
				>.
			</p>
		</div>
	</div>
</section>
