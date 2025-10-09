<script lang="ts">
	import Icon from '$components/fontawesome/Icon.svelte';
	import { theme } from '$stores';
</script>

<button
	class="glass-14 text-on-background cursor-pointer rounded p-2"
	type="button"
	onclick={() => {
		if ($theme === 'light') theme.set('dark');
		else if ($theme === 'dark') theme.set('auto');
		else theme.set('light');
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
