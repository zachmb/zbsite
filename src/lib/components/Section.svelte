<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { withoutProps } from '$utils';

	// https://svelte.dev/docs/svelte/@attach#Passing-attachments-to-components
	type Props = SvelteHTMLElements['section'] & {
		title: string;
		children: Snippet;
	};
	let { title, children, ...rest }: Props = $props();
</script>

<section class="relative h-screen {rest.class || ''}" {...withoutProps(rest, 'class')}>
	<h2
		class="!text-secondary !orbitron-700 pointer-events-none absolute top-1/2 left-1/2 translate-[-50%] text-center opacity-40 select-none"
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
