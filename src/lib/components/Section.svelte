<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = { title: string; children: Snippet };
	let { title, children }: Props = $props();
</script>

<section class="relative h-screen">
	<h2
		class="!text-tertiary !orbitron-700 pointer-events-none absolute top-1/2 left-1/2 translate-[-50%] text-center opacity-40 select-none"
	>
		{title}
	</h2>
	{@render children()}
</section>

<style>
	h2 {
		font-size: clamp(1rem, 15vw, 10rem);
	}
</style>
