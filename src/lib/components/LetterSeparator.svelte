<script lang="ts">
	import { randomInt, times } from '$utils';
	import textGlitch, { type TextGlitchOptions } from '$utils/text-glitch';

	type Props = { rows: number; columns: number; options?: Partial<TextGlitchOptions> };
	let { rows, columns, options = {} }: Props = $props();
</script>

<div
	class="orbitron-700 text-tertiary-container grid overflow-hidden text-2xl select-none md:text-4xl lg:text-6xl"
	style={`grid-template-columns: repeat(${columns}, 1fr);`}
>
	{#each times(rows * columns)}
		<span {@attach textGlitch(options)} class="flex items-center justify-center">
			{String.fromCharCode(randomInt(33 /* ! */, 126 /* ~ */))}
		</span>
	{/each}
</div>
