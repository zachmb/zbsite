<script lang="ts">
	import type { Repository } from '$utils/github';

	type Props = { repository: Repository };
	let { repository }: Props = $props();
</script>

<li>
	<a href={repository.html_url} target="_blank" rel="noopener noreferrer">{repository.name}</a>{#if repository.description}
		— {repository.description}{/if}
</li>
