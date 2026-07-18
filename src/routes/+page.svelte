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
				Then and now — shipping since before I could code. Westwood, Los Angeles, California.
			</figcaption>
		</figure>

		<!-- Essay -->
		<article class="prose">
			<p>
				I'm 18, studying
				<a
					href="https://publish.illinois.edu/illinoisadvertising/computer-science-advertising-illinois/"
					target="_blank"
					rel="noopener noreferrer">Computer Science + Advertising</a
				> at Illinois. I build things and try to get people to use them. That's most of what I do.
			</p>

			<p>
				I've been shipping since before I could really code — small sites, tools no one asked for,
				stuff that broke in front of the three people using it. Most of it failed. What stuck with me
				is that the gap between an idea and a real thing in someone's hands is a lot smaller than
				people act like it is, and almost no one bothers to close it.
			</p>

			<p>
				Right now most of my time goes into <a
					href="https://favente.so"
					target="_blank"
					rel="noopener noreferrer">Favente</a
				>. The best marketers for a product are the people who already love it, so Favente helps
				startups recruit, train, and pay creators from their own user base — with AI that coaches
				them instead of just grading them, and payouts that land automatically when the views do.
			</p>

			<p>
				The point isn't automating people away. It's handing someone a superpower and getting out of
				the way.
			</p>

			<p>
				If that's your kind of thing, <a href="mailto:zmb3@illinois.edu">email me</a>. My code's on
				<a href="/work">Work</a>, and I'm on
				<a href="https://www.linkedin.com/in/zacharybas/" target="_blank" rel="noopener noreferrer"
					>LinkedIn</a
				>.
			</p>

			<p class="text-muted">— Z</p>
		</article>
	</main>

	<SiteFooter />
</div>
