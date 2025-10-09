<script lang="ts">
	import Icon from '$components/fontawesome/Icon.svelte';
	import { theme } from '$stores';
	import { fahhhhh } from '$utils/sounds';
</script>

<button
	class="glass-14 cursor-pointer rounded p-2"
	type="button"
	onclick={() => {
		if ($theme === 'light') theme.set('dark');
		else if ($theme === 'dark') theme.set('auto');
		else {
			theme.set('light');
			fahhhhh.play();
		}
	}}
>
	{#if $theme === 'light'}
		<Icon pack="utility" style="semibold" name="sun" />
	{:else if $theme === 'dark'}
		<Icon pack="utility" style="semibold" name="moon" />
	{:else}
		<Icon pack="utility" style="semibold" name="laptop" />
	{/if}
</button>
