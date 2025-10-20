<script lang="ts">
	import type { PossiblyUndefined } from '@madkarma/ts-utils/types';
	import type { PageProps } from './$types';
	import Landing from '$components/Landing.svelte';
	import Section from '$components/Section.svelte';
	import { randomIntBetween } from '$utils';

	let { data }: PageProps = $props();

	type PosCallback = () => { x: number; y: number };

	const randomPos: PosCallback = () => {
		const x = randomIntBetween(0, window.innerWidth - 150);
		const y = randomIntBetween(0, window.innerHeight - 50);
		return { x, y };
	};

	const sentences: {
		paragraph: string;
		button: string;
		buttonPos: PosCallback;
		action?: () => void;
	}[] = [
		{
			paragraph: "If you're a cool person, you'll read my about me from the terminal :)",
			button: 'Show it to me here',
			buttonPos: () => naturalButtonPos || { x: 0, y: 0 }
		},
		{
			paragraph: "Come onnnn, it's way cooler in the terminal!",
			button: 'No, I said show me here',
			buttonPos: randomPos
		},
		{
			paragraph: 'Pleaseeeeee, just this once?',
			button: 'I said NO!',
			buttonPos: randomPos
		},
		{
			paragraph: "Fine, you win. Here's my about me.",
			button: 'Thank you!',
			buttonPos: randomPos,
			action: () => (showContent = true)
		}
	];

	let showContent = $state(false);
	let currentSentencesIndex = $state(0);
	let currentSentences = $derived(sentences[currentSentencesIndex % sentences.length]);
	let naturalButtonPos: PossiblyUndefined<ReturnType<PosCallback>> = $state(undefined);

	$effect(() => currentSentences.action?.());
</script>

<main class="bg-background">
	<Landing title="MADKARMA" />

	<Section title="About me">
		<div class="text-text relative flex h-full flex-col items-center justify-center gap-4">
			<p>{currentSentences.paragraph}</p>
			<button
				class="cursor-pointer"
				style:transform={naturalButtonPos
					? `translate(${currentSentences.buttonPos().x - naturalButtonPos.x}px, ${currentSentences.buttonPos().y - naturalButtonPos.y}px)`
					: undefined}
				onclick={() => {
					currentSentencesIndex++;
				}}
				{@attach (button) => {
					if (!naturalButtonPos) {
						const rect = button.getBoundingClientRect();
						naturalButtonPos = { x: rect.left, y: rect.top };
					}
				}}
			>
				{currentSentences.button}
			</button>
		</div>
	</Section>
</main>

<style>
	button {
		transition: transform 0.3s ease-in-out;
	}
</style>
