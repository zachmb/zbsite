<script lang="ts">
	// Small "purpose" line shown at the top of each pillar page (Tactics,
	// Meditations, Orthodoxy), stating how that discipline is meant to be used.
	let { children }: { children: import('svelte').Snippet } = $props();
</script>

<p class="mb-6 text-sm text-gray-500">
	<b class="text-gray-700">The Purpose:</b>
	{@render children()}
</p>
