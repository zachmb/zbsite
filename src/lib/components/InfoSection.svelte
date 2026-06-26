<script lang="ts">
	let nav = [
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/zacharybas/', external: true },
		{ label: 'Email', href: 'mailto:zachmb2008@gmail.com', external: false }
	];

	function link(href: string, label: string, external = true) {
		return { href, label, external };
	}

	// Inline links used in the bio below.
	let kazwire = link('https://kazwire.com', 'Kazwire');
	let uiuc = link(
		'https://publish.illinois.edu/illinoisadvertising/computer-science-advertising-illinois/',
		'University of Illinois Urbana-Champaign'
	);
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
			<p>I'm the Founder of Deo:</p>
			<p class="-mt-5 pl-1 opacity-90">— The PLG layer for B2C</p>

			<div class="flex flex-col gap-1">
				<p>
					I'm also the Founder of
					<a
						href={kazwire.href}
						target="_blank"
						rel="noopener noreferrer"
						class="text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
						>Kazwire</a
					>:
				</p>
				<p class="pl-1 opacity-90">— A browser-gaming site with 3.8M+ users and 120M+ page views</p>
				<p class="pl-1 opacity-90">
					— Built full-stack on Svelte, Tailwind, TypeScript, Node, and Postgres
				</p>
				<p class="pl-1 opacity-90">— 700+ forks on GitHub, grown by an 8-person UGC team</p>
			</div>

			<div class="flex flex-col gap-1">
				<p>I run a tech YouTube channel:</p>
				<p class="pl-1 opacity-90">— 23M+ views and 200M+ impressions</p>
				<p class="pl-1 opacity-90">— Featured on the Joe Rogan Experience and Tier 1 streams</p>
			</div>

			<p>
				I'm studying Computer Science + Advertising at the
				<a
					href={uiuc.href}
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
					>University of Illinois Urbana-Champaign</a
				>
				on a full ride — and might double major with Physics.
			</p>

			<div class="flex flex-col gap-1">
				<p>Before all that:</p>
				<p class="pl-1 opacity-90">— Co-founded Split Expenses, a FinTech app</p>
				<p class="pl-1 opacity-90">— Growth Engineer at Superpower</p>
			</div>

			<p class="opacity-90">I'm 18.</p>
		</div>
	</div>
</section>
