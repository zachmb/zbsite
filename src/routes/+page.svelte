<script lang="ts">
	import type { PageProps } from './$types';
	import Landing from '$components/Landing.svelte';

	let { data }: PageProps = $props();
</script>

<main class="bg-background">
	<Landing title="MADKARMA" />
</main>
