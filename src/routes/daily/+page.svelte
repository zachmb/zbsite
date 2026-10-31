<script lang="ts">
	import { onMount } from 'svelte';
	import tactics from '$lib/tactics.json';
	import { quotes } from '$lib/meditations-quotes';
	import philokalia from '$lib/philokalia.json';

	type Item = { text: string; label: string; href: string };

	// One pool per tradition.
	const tacticsPool: Item[] = tactics.works.flatMap((w, wi) =>
		w.sections.map((s) => ({ text: s.text, label: w.title, href: `/tactics?work=${wi + 1}` }))
	);
	const medPool: Item[] = quotes.map((q) => ({
		text: q.text,
		label: `Marcus Aurelius, Meditations ${q.book}.${q.section}`,
		href: `/meditations?book=${q.book}&section=${q.section}`
	}));
	const orthoPool: Item[] = philokalia.works.flatMap((w, wi) =>
		w.excerpt.map((e) => ({ text: e.text, label: `${w.author}, ${w.title}`, href: `/orthodoxy?work=${wi + 1}` }))
	);

	// Deterministic pick for a given day + salt, so each day is fixed for everyone
	// and changes once per day.
	const pick = (pool: Item[], day: number, salt: number) => {
		const x = Math.sin(day * 9301 + salt * 49297) * 233280;
		return pool[Math.floor((x - Math.floor(x)) * pool.length)];
	};

	const pillars = [
		{ key: 'tactics', name: 'Tactics', purpose: 'How to win in the world.', pool: tacticsPool, salt: 1 },
		{ key: 'meditations', name: 'Meditations', purpose: 'How to process the world.', pool: medPool, salt: 2 },
		{ key: 'orthodoxy', name: 'Orthodoxy', purpose: 'How to transcend the world.', pool: orthoPool, salt: 3 }
	];

	let day = $state(0);
	const today = $derived(pillars.map((p) => ({ ...p, item: pick(p.pool, day, p.salt) })));
	const dateLabel = $derived(
		new Date(day * 86400000).toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			timeZone: 'UTC'
		})
	);

	// Review streak (local only).
	let streak = $state(0);
	let best = $state(0);
	let reviewedToday = $state(false);
	const KEY = 'daily-review';
	const dayStr = (d: number) => new Date(d * 86400000).toISOString().slice(0, 10);

	onMount(() => {
		// Local day number (respects the viewer's timezone).
		const now = new Date();
		day = Math.floor((now.getTime() - now.getTimezoneOffset() * 60000) / 86400000);
		try {
			const s = JSON.parse(localStorage.getItem(KEY) || '{}');
			streak = s.streak || 0;
			best = s.best || 0;
			reviewedToday = s.last === dayStr(day);
			if (s.last && s.last !== dayStr(day) && s.last !== dayStr(day - 1)) streak = 0; // missed a day
		} catch {
			/* ignore */
		}
	});

	function markReviewed() {
		if (reviewedToday) return;
		const s = (() => {
			try {
				return JSON.parse(localStorage.getItem(KEY) || '{}');
			} catch {
				return {};
			}
		})();
		streak = s.last === dayStr(day - 1) ? (s.streak || 0) + 1 : 1;
		best = Math.max(best, streak);
		reviewedToday = true;
		localStorage.setItem(KEY, JSON.stringify({ last: dayStr(day), streak, best }));
	}
</script>

<svelte:head>
	<title>Daily — Zachary Basinger</title>
	<meta name="description" content="One passage a day from three traditions: Tactics, Meditations, Orthodoxy." />
</svelte:head>

<header class="mb-6">
	<h1 class="mb-1 text-3xl font-bold">Daily</h1>
	<p class="text-[#111]">
		One passage a day from each of the three. Act, process, transcend. Come back tomorrow for the
		next.
	</p>
	<p class="mt-1 text-sm text-[#111]">{dateLabel}</p>
</header>

{#each today as p}
	<section class="mb-8 border-t border-gray-200 pt-4">
		<h2 class="text-xl font-bold">{p.name}</h2>
		<p class="mb-3 text-sm text-[#111]">{p.purpose}</p>
		<blockquote class="mb-2 text-[#111] italic">&ldquo;{p.item.text}&rdquo;</blockquote>
		<p class="text-sm text-[#111]">
			{p.item.label} · <a href={p.item.href}>Go deeper →</a>
		</p>
	</section>
{/each}

<section class="mt-10 border-t border-gray-200 pt-4">
	{#if reviewedToday}
		<p>
			<b>Reviewed today.</b>
			{streak}-day streak{best > streak ? ` · best ${best}` : ''}. See you tomorrow.
		</p>
	{:else}
		<button type="button" class="border border-gray-400 px-3 py-1 font-bold" onclick={markReviewed}>
			Mark today reviewed
		</button>
		{#if streak > 0}<span class="ml-2 text-sm text-[#111]">current streak: {streak} days</span>{/if}
	{/if}
</section>
