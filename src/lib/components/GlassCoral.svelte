<script lang="ts">
	import Section from '$components/Section.svelte';
</script>

<Section title="GlassCoral">
	<div class="flex flex-col gap-16 md:gap-24">
		<div class="flex flex-col gap-6 text-lg leading-relaxed text-gray-300 md:text-xl">
			<p>
				<span class="text-primary font-semibold">GlassCoral</span> is an AI SaaS studio building at the intersection
				of aesthetic excellence and functional depth.
			</p>
			<p>
				We operate in two distinct zones:
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-2">
			<!-- The Trench -->
			<div class="glass-14 relative overflow-hidden rounded-3xl p-8 border border-white/5 group transition-all duration-500 hover:border-white/10">
				<div class="absolute inset-0 bg-gradient-to-b from-black/80 to-blue-950/20 opacity-60"></div>
				<div class="relative z-10 flex flex-col gap-4">
					<h3 class="font-orbitron text-2xl font-bold text-white tracking-wide">The Trench</h3>
					<p class="text-gray-400">
						The deep, unseen layer where stealth startups are forged. Here, we experiment with proprietary models,
						autonomous agents, and rapid iteration cycles away from the public eye.
					</p>
					<div class="mt-4 flex flex-wrap gap-2">
						<span class="rounded-full bg-white/5 px-3 py-1 text-xs text-xs text-gray-300 border border-white/5">Stealth Mode</span>
						<span class="rounded-full bg-white/5 px-3 py-1 text-xs text-xs text-gray-300 border border-white/5">R&D</span>
					</div>
				</div>
			</div>

			<!-- The Reef -->
			<div class="glass-14 relative overflow-hidden rounded-3xl p-8 border border-white/5 group transition-all duration-500 hover:border-white/10">
				<div class="absolute inset-0 bg-gradient-to-b from-white/5 to-coral-500/5 opacity-60"></div>
				<div class="relative z-10 flex flex-col gap-4">
					<h3 class="font-orbitron text-2xl font-bold text-coral-400 tracking-wide">The Reef</h3>
					<p class="text-gray-400">
						The vibrant, public-facing ecosystem. Successful projects from The Trench migrate here to bloom.
						This is where our polished, user-ready applications live and grow.
					</p>
					<div class="mt-4 flex flex-wrap gap-2">
						<span class="rounded-full bg-coral-500/10 px-3 py-1 text-xs text-coral-300 border border-coral-500/20">Public Beta</span>
						<span class="rounded-full bg-coral-500/10 px-3 py-1 text-xs text-coral-300 border border-coral-500/20">Live Products</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</Section>

<style>
	@reference "tailwindcss";
	@reference "../../app.css";

	.font-orbitron {
		font-family: 'Orbitron', sans-serif;
	}
</style>
