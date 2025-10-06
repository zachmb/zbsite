<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	let showTitle = $state(false);
	onMount(() => setTimeout(() => (showTitle = true), 1));
</script>

<div class="relative h-screen overflow-hidden">
	<img
		src="/backgrounds/mountain-with-sky.webp"
		alt="Mountain background with sky"
		class="absolute h-full w-full object-cover"
	/>
	{#if showTitle}
		<h1
			class="space-grotesk-600 absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-[43%] transform px-4 whitespace-nowrap text-white"
			in:slide={{ duration: 1000, easing: expoOut, axis: 'y' }}
		>
			MadKarma
		</h1>
	{/if}
	<img
		src="/backgrounds/mountain.webp"
		alt="Mountain background with no sky"
		class="absolute z-10 h-full w-full object-cover"
	/>
</div>

<style>
	h1 {
		font-size: clamp(1rem, 15vw, 10rem);
	}
</style>
