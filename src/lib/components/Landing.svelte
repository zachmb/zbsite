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
		barsAnimationDurationMs?: number;
	};
	let {
		title,
		titleInDelay = 750,
		titleInDuration = 1100,
		showBars = true,
		barsAnimationDurationMs = 8000
	}: Props = $props();

	title = title.trim();

	let showContent = $state(false);
	let backImageLoaded = $state(false);
	let frontImageLoaded = $state(false);

	$effect(() => {
		if (backImageLoaded && frontImageLoaded) showContent = true;
	});
</script>

<div
	class="relative h-screen overflow-hidden"
	style="--bars-duration: {barsAnimationDurationMs}ms;"
>
	{#if showContent && showBars}
		<!-- Top-left horizontal bar -->
		<div class="loading-bar-container-horizontal top-4 left-4">
			<div class="loading-bar loading-bar-horizontal"></div>
		</div>
		<!-- Top-left vertical bar -->
		<div class="loading-bar-container-vertical top-4 left-4">
			<div class="loading-bar loading-bar-vertical"></div>
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
		<!-- Bottom-right vertical bar -->
		<div class="loading-bar-container-vertical right-4 bottom-4">
			<div class="loading-bar loading-bar-vertical-reverse"></div>
		</div>
		<!-- Bottom-right horizontal bar -->
		<div class="loading-bar-container-horizontal right-4 bottom-4">
			<div class="loading-bar loading-bar-horizontal-reverse"></div>
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

	.loading-bar-container-horizontal {
		@apply absolute;
		@apply z-20;
		@apply h-1.5;
		@apply w-1/2 lg:w-1/3;
		@apply overflow-hidden;
		@apply rounded-full;
	}

	.loading-bar-container-vertical {
		@apply absolute;
		@apply z-20;
		@apply w-1.5;
		@apply h-1/2 lg:h-1/3;
		@apply overflow-hidden;
		@apply rounded-full;
	}

	.loading-bar {
		@apply w-1/2;
		@apply h-full;
		@apply bg-white;
		@apply rounded-full;
		@apply opacity-15;
		animation-duration: var(--bars-duration);
		animation-timing-function: ease-in-out;
		animation-iteration-count: infinite;
	}

	.loading-bar-horizontal {
		@apply opacity-15;
		transform: translateX(-100%) translateY(0);
		animation-name: slide-horizontal-tl;
	}

	@keyframes slide-horizontal-tl {
		0%,
		23% {
			transform: translateX(-100%) translateY(0);
		}
		25% {
			transform: translateX(-100%) translateY(0);
		}
		37.5% {
			transform: translateX(100%) translateY(0);
		}
		48% {
			transform: translateX(-100%) translateY(0);
		}
		50%,
		73% {
			transform: translateX(-100%) translateY(0);
		}
		75% {
			transform: translateX(-100%) translateY(0);
		}
		87.5% {
			transform: translateX(100%) translateY(0);
		}
		98% {
			transform: translateX(-100%) translateY(0);
		}
		100% {
			transform: translateX(-100%) translateY(0);
		}
	}

	.loading-bar-vertical {
		@apply h-1/2;
		@apply w-full;
		@apply opacity-15;
		transform: translateX(0) translateY(-100%);
		animation-name: slide-vertical-tl;
	}

	@keyframes slide-vertical-tl {
		0% {
			transform: translateX(0) translateY(-100%);
		}
		12.5% {
			transform: translateX(0) translateY(100%);
		}
		25% {
			transform: translateX(0) translateY(-100%);
		}
		25.01%,
		47% {
			transform: translateX(0) translateY(-100%);
		}
		50% {
			transform: translateX(0) translateY(-100%);
		}
		62.5% {
			transform: translateX(0) translateY(100%);
		}
		75% {
			transform: translateX(0) translateY(-100%);
		}
		75.01%,
		100% {
			transform: translateX(0) translateY(-100%);
		}
	}

	.loading-bar-vertical-reverse {
		@apply h-1/2;
		@apply w-full;
		@apply opacity-15;
		transform: translateX(0) translateY(200%);
		animation-name: slide-vertical-br;
	}

	@keyframes slide-vertical-br {
		0% {
			transform: translateX(0) translateY(200%);
		}
		12.5% {
			transform: translateX(0) translateY(0%);
		}
		25% {
			transform: translateX(0) translateY(200%);
		}
		25.01%,
		47% {
			transform: translateX(0) translateY(200%);
		}
		50% {
			transform: translateX(0) translateY(200%);
		}
		62.5% {
			transform: translateX(0) translateY(0%);
		}
		75% {
			transform: translateX(0) translateY(200%);
		}
		75.01%,
		100% {
			transform: translateX(0) translateY(200%);
		}
	}

	.loading-bar-horizontal-reverse {
		@apply opacity-15;
		transform: translateX(200%) translateY(0);
		animation-name: slide-horizontal-br;
	}

	@keyframes slide-horizontal-br {
		0%,
		23% {
			transform: translateX(200%) translateY(0);
		}
		25% {
			transform: translateX(200%) translateY(0);
		}
		37.5% {
			transform: translateX(0%) translateY(0);
		}
		48% {
			transform: translateX(200%) translateY(0);
		}
		50%,
		73% {
			transform: translateX(200%) translateY(0);
		}
		75% {
			transform: translateX(200%) translateY(0);
		}
		87.5% {
			transform: translateX(0%) translateY(0);
		}
		98% {
			transform: translateX(200%) translateY(0);
		}
		100% {
			transform: translateX(200%) translateY(0);
		}
	}
</style>
