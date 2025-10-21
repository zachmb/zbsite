<script lang="ts">
	import Icon from '$components/fontawesome/Icon.svelte';
	import { theme } from '$stores';
	import sounds from '$utils/sounds';
	import { transition } from '$utils/transitions';

	const toggleTheme = () =>
		transition(() => {
			if ($theme === 'light') theme.set('dark');
			else {
				theme.set('light');
				sounds.fahhhhh.play();
			}
		});
</script>

<button class="glass-14 text-text cursor-pointer rounded p-2" type="button" onclick={toggleTheme}>
	{#if $theme === 'light'}
		<Icon pack="utility" style="semibold" name="sun" />
	{:else}
		<Icon pack="utility" style="semibold" name="moon" />
	{/if}
</button>
