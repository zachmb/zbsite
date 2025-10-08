<script lang="ts">
	import type { PageProps } from './$types';
	import Landing from '$components/Landing.svelte';

	let { data }: PageProps = $props();
</script>

<Landing title="MADKARMA" />
<div class="h-screen"></div>
