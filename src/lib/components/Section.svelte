<script lang="ts">
	import type { Snippet } from 'svelte';
	import { randomIntBetween } from '$utils';

	type Props = { title: string; children: Snippet };
	let { title, children }: Props = $props();

	const id = `${title.toLowerCase().replaceAll(' ', '-')}-${randomIntBetween(0, 1000)}`;
</script>

<section
	{id}
	class="
		before:orbitron-700
		before:text-secondary
		relative
		flex
		h-screen
		items-center
		justify-center
		**:z-1
		before:pointer-events-none
		before:absolute
		before:top-1/2
		before:left-1/2
		before:z-0
		before:w-full
		before:-translate-x-1/2
		before:-translate-y-1/2
		before:text-center
		before:opacity-40
		before:content-[attr(data-title)]
		before:select-none"
	data-title={title}
>
	{@render children()}
</section>

<style>
	section::before {
		font-size: clamp(1rem, 15vw, 10rem);
	}
</style>
