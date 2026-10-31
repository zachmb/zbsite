<script lang="ts">
	import { onMount } from 'svelte';
	import tactics from '$lib/tactics.json';
	import { quotes } from '$lib/meditations-quotes';
	import philokalia from '$lib/philokalia.json';

	type Item = { id: string; text: string; label: string; href: string };

	// One pool per tradition (each item has a stable id for saving).
	const tacticsPool: Item[] = tactics.works.flatMap((w, wi) =>
		w.sections.map((s) => ({ id: `t${wi}-${s.n}`, text: s.text, label: w.title, href: `/tactics?work=${wi + 1}` }))
	);
	const medPool: Item[] = quotes.map((q) => ({
		id: `m${q.book}-${q.section}`,
		text: q.text,
		label: `Marcus Aurelius, Meditations ${q.book}.${q.section}`,
		href: `/meditations?book=${q.book}&section=${q.section}`
	}));
	const orthoPool: Item[] = philokalia.works.flatMap((w, wi) =>
		w.excerpt.map((e) => ({
			id: `o${wi}-${e.n}`,
			text: e.text,
			label: `${w.author}, ${w.title}`,
			href: `/orthodoxy?work=${wi + 1}`
		}))
	);

	// Deterministic pick for a given day + salt: fixed per day, rotates daily.
	const pick = (pool: Item[], d: number, salt: number) => {
		const x = Math.sin(d * 9301 + salt * 49297) * 233280;
		return pool[Math.floor((x - Math.floor(x)) * pool.length)];
	};

	const pillars = [
		{ name: 'Tactics', purpose: 'How to win in the world.', pool: tacticsPool, salt: 1 },
		{ name: 'Meditations', purpose: 'How to process the world.', pool: medPool, salt: 2 },
		{ name: 'Orthodoxy', purpose: 'How to transcend the world.', pool: orthoPool, salt: 3 }
	];

	let realToday = $state(0); // the actual current day number
	let day = $state(0); // the day currently being viewed (archive)

	const today = $derived(pillars.map((p) => ({ ...p, item: pick(p.pool, day, p.salt) })));
	const fmt = (d: number, opts: Intl.DateTimeFormatOptions) =>
		new Date(d * 86400000).toLocaleDateString('en-US', { timeZone: 'UTC', ...opts });
	const dateLabel = $derived(
		fmt(day, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
	);
	const week = $derived(Array.from({ length: 7 }, (_, i) => realToday - 6 + i)); // last 7 days

	// ---- Review streak (local) ----
	let streak = $state(0);
	let best = $state(0);
	let reviewedToday = $state(false);
	const dayStr = (d: number) => new Date(d * 86400000).toISOString().slice(0, 10);

	// ---- Saved passages + spaced repetition (local) ----
	type Saved = Item & { box: number; due: number };
	let saved = $state<Record<string, Saved>>({});
	const INTERVALS = [1, 1, 2, 4, 8, 16, 30];
	const SKEY = 'daily-saved';
	const RKEY = 'daily-review';

	onMount(() => {
		const now = new Date();
		realToday = Math.floor((now.getTime() - now.getTimezoneOffset() * 60000) / 86400000);
		day = realToday;
		try {
			const s = JSON.parse(localStorage.getItem(RKEY) || '{}');
			streak = s.streak || 0;
			best = s.best || 0;
			reviewedToday = s.last === dayStr(realToday);
			if (s.last && s.last !== dayStr(realToday) && s.last !== dayStr(realToday - 1)) streak = 0;
		} catch {
			/* ignore */
		}
		try {
			saved = JSON.parse(localStorage.getItem(SKEY) || '{}');
		} catch {
			/* ignore */
		}
	});

	const persistSaved = () => localStorage.setItem(SKEY, JSON.stringify(saved));
	const isSaved = (id: string) => id in saved;
	function toggleSave(it: Item) {
		if (saved[it.id]) delete saved[it.id];
		else saved[it.id] = { ...it, box: 1, due: realToday };
		saved = { ...saved };
		persistSaved();
	}
	const savedList = $derived(Object.values(saved));
	const dueCount = $derived(savedList.filter((s) => s.due <= realToday).length);

	function markReviewed() {
		if (reviewedToday || day !== realToday) return;
		const s = (() => {
			try {
				return JSON.parse(localStorage.getItem(RKEY) || '{}');
			} catch {
				return {};
			}
		})();
		streak = s.last === dayStr(realToday - 1) ? (s.streak || 0) + 1 : 1;
		best = Math.max(best, streak);
		reviewedToday = true;
		localStorage.setItem(RKEY, JSON.stringify({ last: dayStr(realToday), streak, best }));
	}

	// ---- Flashcard review ----
	let queue = $state<Saved[]>([]);
	let card = $state<Saved | null>(null);
	let revealed = $state(false);
	let reviewing = $state(false);

	function startReview() {
		const due = savedList.filter((s) => s.due <= realToday);
		const pool = (due.length ? due : savedList).slice();
		for (let i = pool.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[pool[i], pool[j]] = [pool[j], pool[i]];
		}
		queue = pool;
		reviewing = true;
		next();
	}
	function next() {
		card = queue.shift() ?? null;
		revealed = false;
		if (!card) reviewing = false;
	}
	function grade(good: boolean) {
		if (!card) return;
		const box = good ? Math.min(card.box + 1, 6) : 1;
		saved[card.id] = { ...card, box, due: realToday + INTERVALS[box] };
		saved = { ...saved };
		persistSaved();
		next();
	}
</script>

<svelte:head>
	<title>Daily — Zachary Basinger</title>
	<meta name="description" content="One passage a day from three traditions, with saved-passage review." />
</svelte:head>

<header class="mb-4">
	<h1 class="mb-1 text-3xl font-bold">Daily</h1>
	<p class="text-[#111]">
		One passage a day from each of the three. Act, process, transcend. Save the ones that land and
		review them over time.
	</p>
</header>

<!-- Day navigation / archive -->
<nav class="mb-6 border-y border-gray-200 py-3">
	<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
		<button type="button" class="font-bold text-[var(--link)] hover:underline" onclick={() => (day -= 1)}
			>← Prev</button
		>
		{#if day !== realToday}
			<button type="button" class="font-bold text-[var(--link)] hover:underline" onclick={() => (day = realToday)}
				>Today</button
			>
		{/if}
		<button
			type="button"
			class="font-bold {day >= realToday ? 'cursor-not-allowed opacity-40' : 'text-[var(--link)] hover:underline'}"
			disabled={day >= realToday}
			onclick={() => (day += 1)}>Next →</button
		>
		<span class="text-sm text-[#111]">{dateLabel}{day === realToday ? ' · today' : ''}</span>
	</div>
	<div class="mt-2 flex flex-wrap gap-x-3 gap-y-1">
		<span class="text-sm text-[#111]">This week:</span>
		{#each week as d}
			<button
				type="button"
				class="text-sm {d === day ? 'font-bold text-black' : 'text-[var(--link)] hover:underline'}"
				onclick={() => (day = d)}>{fmt(d, { weekday: 'short' })}</button
			>
		{/each}
	</div>
</nav>

{#each today as p}
	<section class="mb-8 border-t border-gray-200 pt-4">
		<div class="flex items-baseline justify-between gap-3">
			<h2 class="text-xl font-bold">{p.name}</h2>
			<button
				type="button"
				class="shrink-0 text-sm text-[var(--link)] hover:underline"
				aria-pressed={isSaved(p.item.id)}
				onclick={() => toggleSave(p.item)}>{isSaved(p.item.id) ? '★ Saved' : '☆ Save'}</button
			>
		</div>
		<p class="mb-3 text-sm text-[#111]">{p.purpose}</p>
		<blockquote class="mb-2 text-[#111] italic">&ldquo;{p.item.text}&rdquo;</blockquote>
		<p class="text-sm text-[#111]">{p.item.label} · <a href={p.item.href}>Go deeper →</a></p>
	</section>
{/each}

<!-- Review streak (today only) -->
<section class="mt-8 border-t border-gray-200 pt-4">
	{#if day !== realToday}
		<p class="text-sm text-[#111]">Viewing a past day. <button type="button" class="text-[var(--link)] hover:underline" onclick={() => (day = realToday)}>Back to today →</button></p>
	{:else if reviewedToday}
		<p>
			<b>Reviewed today.</b>
			{streak}-day streak{best > streak ? ` · best ${best}` : ''}. See you tomorrow.
		</p>
	{:else}
		<button type="button" class="border border-gray-400 px-3 py-1 font-bold" onclick={markReviewed}
			>Mark today reviewed</button
		>
		{#if streak > 0}<span class="ml-2 text-sm text-[#111]">current streak: {streak} days</span>{/if}
	{/if}
</section>

<!-- Saved passages + spaced-repetition review -->
<section class="mt-10 border-t border-gray-200 pt-4">
	<h2 class="mb-1 text-xl font-bold">Review</h2>
	{#if savedList.length === 0}
		<p class="text-sm text-[#111]">Save a passage above (☆) to build a review deck. Saved passages come back on a spaced schedule so they stick.</p>
	{:else if reviewing && card}
		<p class="mb-2 text-sm text-[#111]">{card.label}</p>
		{#if revealed}
			<blockquote class="mb-3 text-[#111] italic">&ldquo;{card.text}&rdquo;</blockquote>
			<div class="flex flex-wrap gap-3">
				<button type="button" class="border border-gray-400 px-3 py-1 font-bold" onclick={() => grade(false)}>Again (soon)</button>
				<button type="button" class="border border-gray-400 px-3 py-1 font-bold" onclick={() => grade(true)}>Got it (later)</button>
			</div>
		{:else}
			<p class="mb-3 text-sm text-[#111]">Try to recall it, then reveal.</p>
			<button type="button" class="border border-gray-400 px-3 py-1 font-bold" onclick={() => (revealed = true)}>Reveal</button>
		{/if}
	{:else}
		<p class="mb-3 text-sm text-[#111]">
			{savedList.length} saved · {dueCount} due for review.
		</p>
		<button type="button" class="border border-gray-400 px-3 py-1 font-bold" onclick={startReview}
			>{dueCount ? 'Start review' : 'Review anyway'}</button
		>
		<ul class="mt-4 list-none space-y-1">
			{#each savedList as s}
				<li class="text-sm">
					<a href={s.href}>{s.label}</a>
					<button type="button" class="ml-2 text-[var(--link)] hover:underline" onclick={() => toggleSave(s)}>remove</button>
				</li>
			{/each}
		</ul>
	{/if}
</section>
