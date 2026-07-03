<script lang="ts">
	import type { Repository } from '$utils/github';

	type Props = { repository: Repository };
	let { repository }: Props = $props();

	const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
</script>

<a
	href={repository.html_url}
	target="_blank"
	rel="noopener noreferrer"
	class="group block border-t border-rule py-5 transition-colors hover:bg-[#fafafa]"
>
	<div class="flex items-baseline justify-between gap-4">
		<span class="font-serif text-[1.2rem] tracking-tight text-text group-hover:text-link">
			{repository.name}
		</span>
		<span class="shrink-0 text-[0.75rem] text-muted">{fmtDate(repository.updated_at)}</span>
	</div>

	{#if repository.description}
		<p class="mt-1.5 text-[0.9rem] leading-relaxed text-text/80">{repository.description}</p>
	{/if}

	<div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] text-muted">
		{#if repository.stargazers_count > 0}
			<span>★ {repository.stargazers_count}</span>
		{/if}
		{#each repository.topics.slice(0, 4) as topic}
			<span class="text-faint">#{topic}</span>
		{/each}
	</div>
</a>
