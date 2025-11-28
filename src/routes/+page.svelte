<script lang="ts">
	import type { PageProps } from './$types';
	import Landing from '$components/Landing.svelte';
	import Section from '$components/Section.svelte';
	import Holding from '$components/Holding.svelte';
	import Seriously from '$components/Seriously.svelte';

	let { data }: PageProps = $props();
</script>

<main class="bg-background">
	<Landing title="ZACHARY" />

	<Section title="About me">
		<div class="text-text flex h-full flex-col items-center justify-center gap-4">
			{data.user_info.bio}
		</div>
	</Section>

	<Seriously />

	<Holding />
</main>
