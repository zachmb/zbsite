<script lang="ts">
	import type { Repository } from '$utils/github';

	type Props = { repository: Repository };
	let { repository }: Props = $props();
</script>

<a href={repository.html_url} class="block">{repository.name}</a>
