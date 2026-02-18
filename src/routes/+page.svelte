<script lang="ts">
	import type { PageProps } from './$types';
	import Landing from '$components/Landing.svelte';
	import InfoSection from '$components/InfoSection.svelte';

	let { data }: PageProps = $props();
</script>

<main class="bg-background">
	<Landing title="ZACHARY" />
	<InfoSection />
</main>
