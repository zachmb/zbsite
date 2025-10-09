<script lang="ts">
	import type { PageProps } from './$types';
	import Landing from '$components/Landing.svelte';
	import LetterSeparator from '$components/LetterSeparator.svelte';

	let { data }: PageProps = $props();
</script>

<div class="bg-background">
	<Landing title="MADKARMA" />
	<LetterSeparator rows={10} columns={18} />
</div>
