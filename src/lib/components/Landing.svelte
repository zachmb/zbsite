<script lang="ts">
	// https://svelte.dev/docs/svelte/svelte-transition
	import { slide } from 'svelte/transition';
	// https://svelte.dev/playground/easing
	import { expoOut } from 'svelte/easing';

	type Props = { title: string; titleInDelay?: number; titleInDuration?: number };
	let { title, titleInDelay = 750, titleInDuration = 1100 }: Props = $props();

	title = title.trim();

	let showTitle = $state(false);
	let backImageLoaded = $state(false);
	let frontImageLoaded = $state(false);

	$effect(() => {
		if (backImageLoaded && frontImageLoaded) showTitle = true;
	});
</script>

<div class="relative h-screen overflow-hidden">
	<!-- https://unsplash.com/photos/snow-mountain-under-stars-phIFdC6lA4E -->
	<img
		src="/backgrounds/mountain-with-sky.webp"
		alt="Mountain background with sky"
		class="absolute h-full w-full object-cover"
		onload={() => (backImageLoaded = true)}
	/>
	{#if showTitle}
		<h1
			class="space-grotesk-700 absolute top-[46.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 transform px-4 whitespace-nowrap text-white mix-blend-overlay md:top-[45%] lg:top-[44%]"
			in:slide={{ delay: titleInDelay, duration: titleInDuration, easing: expoOut, axis: 'y' }}
		>
			{title}
		</h1>
	{/if}
	<!-- https://unsplash.com/photos/snow-mountain-under-stars-phIFdC6lA4E -->
	<img
		src="/backgrounds/mountain.webp"
		alt="Mountain background with no sky"
		class="absolute z-10 h-full w-full object-cover"
		onload={() => (frontImageLoaded = true)}
	/>
</div>

<style>
	h1 {
		font-size: clamp(1rem, 15vw, 10rem);
	}
</style>
