<script lang="ts">
	import SiteHeader from '$components/SiteHeader.svelte';
	import SiteFooter from '$components/SiteFooter.svelte';
</script>

<div class="mx-auto w-full max-w-[640px] px-6">
	<SiteHeader />

	<main>
		<!-- Masthead -->
		<div class="mb-10">
			<h1 class="font-serif text-[2.6rem] leading-[1.05] tracking-[-0.02em] md:text-[3.1rem]">
				Zachary Basinger
			</h1>
			<div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] text-muted">
				<span>@zachbas</span>
				<span class="text-faint">·</span>
				<span>18</span>
				<span class="text-faint">·</span>
				<span>CS + Advertising, UIUC</span>
				<span class="text-faint">·</span>
				<a href="mailto:zmb3@illinois.edu" class="link">zmb3@illinois.edu</a>
			</div>
		</div>

		<!-- Photo -->
		<figure class="mb-12">
			<div class="flex flex-wrap items-end gap-3">
				<img
					src="/images/zach-young.png"
					alt="Zachary Basinger as a kid"
					width="220"
					height="220"
					class="w-[140px] rounded-[3px] border border-rule object-cover md:w-40"
				/>
				<img
					src="/images/zach.png"
					alt="Zachary Basinger"
					width="220"
					height="220"
					class="w-[140px] rounded-[3px] border border-rule object-cover md:w-40"
				/>
			</div>
			<figcaption class="mt-2 text-[0.8125rem] text-muted">
				Then and now. Westwood, Los Angeles, California.
			</figcaption>
		</figure>

		<!-- Links -->
		<nav class="flex flex-wrap items-center gap-x-2 text-[0.95rem]">
			<a href="/work" class="link">Work</a>
			<span class="text-faint">·</span>
			<a href="mailto:zmb3@illinois.edu" class="link">Email</a>
			<span class="text-faint">·</span>
			<a
				href="https://www.linkedin.com/in/zacharybas/"
				target="_blank"
				rel="noopener noreferrer"
				class="link">LinkedIn</a
			>
			<span class="text-faint">·</span>
			<a
				href="https://github.com/zachbas"
				target="_blank"
				rel="noopener noreferrer"
				class="link">GitHub</a
			>
		</nav>
	</main>

	<SiteFooter />
</div>
