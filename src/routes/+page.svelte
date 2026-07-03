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
			<img
				src="/images/zach.png"
				alt="Zachary Basinger"
				width="220"
				height="220"
				class="w-[200px] rounded-[3px] border border-rule object-cover md:w-[220px]"
			/>
			<figcaption class="mt-2 text-[0.8125rem] text-muted">
				Westwood, Los Angeles, California
			</figcaption>
		</figure>

		<!-- Essay -->
		<article class="prose">
			<p>
				I'm 18. I make things on the internet and try to get people to care about them. Right now
				that means studying
				<a
					href="https://publish.illinois.edu/illinoisadvertising/computer-science-advertising-illinois/"
					target="_blank"
					rel="noopener noreferrer">Computer Science + Advertising</a
				>
				at the University of Illinois — a strange, perfect major that is really just the two halves of
				the same instinct: <em>build the thing</em>, then <em>make it spread</em>.
			</p>

			<p>
				I've been shipping since before I could really code well. Small sites, tools nobody asked
				for, projects that broke in front of the three people using them. Most of them failed. The
				ones that didn't taught me the only lesson I actually trust: the distance between an idea and
				a real thing in someone's hands is shorter than everyone pretends, and almost no one is
				willing to walk it.
			</p>

			<blockquote>
				<em
					>The people who win aren't the ones with the best ideas. They're the ones who kept putting
					unfinished things in front of strangers.</em
				>
			</blockquote>

			<p>
				So that's the whole philosophy, if you can call it one. I build in public, I ship before I'm
				ready, and I let the internet grade my homework. It's humbling on a daily basis and I
				wouldn't trade it.
			</p>

			<hr />

			<p>
				Lately most of that energy goes into <a
					href="https://deo.so"
					target="_blank"
					rel="noopener noreferrer">Deo</a
				>. The premise is simple and, I think, obviously true once you sit with it: the best marketers
				for a product are the people who already love it. Deo helps startups recruit, train, and
				actually pay creators from their own user base — real coaching, AI that verifies the work, and
				payouts that hit automatically when the views do.
			</p>

			<p>
				The part I care about most isn't the automation. It's that the AI is pointed at the human, not
				at replacing them. A creator who submits something that doesn't land shouldn't get a cold
				rejection — they should get a coaching note: here's what worked, here's the one thing to fix,
				here's the reward waiting on the other side. Every win they earn follows them, brand to brand,
				as a track record they own. The goal is to make ordinary people more hirable, not more
				obsolete.
			</p>

			<p>
				I think a lot about that distinction. It's easy to build technology that makes people smaller.
				The harder, better thing is to build tools that hand someone a superpower and then get out of
				the way.
			</p>

			<hr />

			<p>
				If any of this is your kind of thing — building, distribution, giving normal people an unfair
				advantage — I'd like to hear from you. The best way to reach me is
				<a href="mailto:zmb3@illinois.edu">email</a>. You can also find the code I'm proud of (and
				the code I'm not) on <a href="/work">Work</a>, or track me down on
				<a href="https://www.linkedin.com/in/zacharybas/" target="_blank" rel="noopener noreferrer"
					>LinkedIn</a
				>.
			</p>

			<p class="text-muted">— Z</p>
		</article>
	</main>

	<SiteFooter />
</div>
