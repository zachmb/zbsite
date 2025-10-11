<script lang="ts">
	import sounds from '$utils/sounds';
	import { userHasInteracted } from '$stores';
	import { flashbang } from '$stores';

	type Props = { chance: number };
	let { chance }: Props = $props();

	const shouldFlash = $flashbang || Boolean.random(chance);
	let imageLoaded = $state(false);
	let timeoutExpired = $state(false);
	let audioPlayed = $state(false);

	$effect(() => {
		if (!shouldFlash || !imageLoaded || audioPlayed) {
			if (document.fullscreenElement) document.exitFullscreen();
			return;
		}

		flashbang.remove();

		if ($userHasInteracted) document.body.requestFullscreen();

		sounds.thinkFast.play(() => (audioPlayed = true));
		setTimeout(() => (timeoutExpired = true), 1200);
	});
</script>

{#if shouldFlash && $userHasInteracted}
	{#if !timeoutExpired}
		<img
			src="/backgrounds/think-fast.webp"
			alt="Think fast"
			onload={() => (imageLoaded = true)}
			class="pointer-events-none fixed inset-0 z-[9999] h-full w-full object-contain object-center select-none"
		/>
	{:else if !audioPlayed}
		<!-- prettier-ignore -->
		<div class="pointer-events-none fixed inset-0 z-[9999] h-full w-full bg-white select-none"></div>
	{/if}
{/if}
