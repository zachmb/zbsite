<script lang="ts">
	let links = [
		{
			title: 'Portfolio',
			description: 'Glasscoral - My work and projects.',
			href: 'https://glasscoral.com',
			color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200'
		},
		{
			title: 'LinkedIn',
			description: 'Connect with me professionally.',
			href: 'https://www.linkedin.com/in/zacharybas/',
			color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
		},
		{
			title: 'Major',
			description: 'CS + Advertising at UIUC.',
			href: 'https://publish.illinois.edu/illinoisadvertising/computer-science-advertising-illinois/',
			color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200'
		},
		{
			title: 'Why?',
			description: 'Why CS + Advertising?',
			href: 'https://siebelschool.illinois.edu/news/why-you-want-cs-econ-advertising-degree',
			color: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200'
		}
	];
</script>

<section class="py-24 px-4 md:px-8 max-w-7xl mx-auto">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each links as link}
			<a
				href={link.href}
				target="_blank"
				rel="noopener noreferrer"
				class="group relative overflow-hidden rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-6 transition-all hover:shadow-lg hover:-translate-y-1 block"
			>
				<div
					class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none {link.color}"
				></div>
				<div class="relative z-10">
					<h3 class="font-bold text-xl mb-2 text-white group-hover:text-white">
						{link.title}
					</h3>
					<p
						class="text-sm opacity-80 text-white group-hover:text-white leading-relaxed"
					>
						{link.description}
					</p>
                    <div class="mt-4 flex items-center text-xs font-medium uppercase tracking-wider opacity-60 group-hover:opacity-90 text-white">
                        <span>Visit</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </div>
				</div>
			</a>
		{/each}
	</div>
</section>
