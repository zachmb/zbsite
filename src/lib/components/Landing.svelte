<script lang="ts">
	// https://svelte.dev/docs/svelte/svelte-transition
	import { slide } from 'svelte/transition';
	// https://svelte.dev/playground/easing
	import { expoOut } from 'svelte/easing';

	type Props = {
		title: string;
		titleInDelay?: number;
		titleInDuration?: number;
		showBars?: boolean;
	};
	let { title, titleInDelay = 750, titleInDuration = 1100, showBars = true }: Props = $props();

	title = title.trim();

	let showContent = $state(false);
	let backImageLoaded = $state(false);
	let frontImageLoaded = $state(false);

	$effect(() => {
		if (backImageLoaded && frontImageLoaded) showContent = true;
	});
</script>

<div class="relative h-screen overflow-hidden">
	{#if showContent && showBars}
		<div class="loading-bar-container top-4 left-4">
			<div class="loading-bar"></div>
		</div>
	{/if}

	<!-- https://unsplash.com/photos/snow-mountain-under-stars-phIFdC6lA4E -->
	<img
		src="/backgrounds/mountain-with-sky.webp"
		alt="Mountain background with sky"
		class="image"
		onload={() => (backImageLoaded = true)}
	/>

	{#if showContent}
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
		class="image z-10"
		onload={() => (frontImageLoaded = true)}
	/>

	{#if showContent && showBars}
		<div class="loading-bar-container right-4 bottom-4">
			<div class="loading-bar loading-bar-reverse"></div>
		</div>
	{/if}
</div>

<style>
	@reference 'tailwindcss';

	h1 {
		font-size: clamp(1rem, 15vw, 10rem);
	}

	.image {
		@apply absolute;
		@apply h-full;
		@apply w-full;
		@apply object-cover;
	}

	.loading-bar-container {
		@apply absolute;
		@apply z-20;
		@apply h-1.5;
		@apply w-1/3;
		@apply overflow-hidden;
		@apply rounded-full;
	}

	.loading-bar {
		@apply w-1/2;
		@apply h-full;
		@apply bg-white;
		@apply rounded-full;
		@apply opacity-15;
		transform: translateX(-200%);
		animation-duration: 4s;
		animation-timing-function: ease-in-out;
		animation-iteration-count: infinite;
		animation-name: slide;
	}

	@keyframes slide {
		0% {
			transform: translateX(-50%);
		}
		50% {
			transform: translateX(150%);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	.loading-bar-reverse {
		transform: translateX(200%);
		animation-name: slide-reverse;
	}

	@keyframes slide-reverse {
		0% {
			transform: translateX(150%);
		}
		50% {
			transform: translateX(-50%);
		}
		100% {
			transform: translateX(150%);
		}
	}
</style>
