import { error } from '@sveltejs/kit';
import data from '$lib/essays.json';

export const prerender = true;

export function entries() {
	return data.essays.map((e) => ({ slug: e.slug }));
}

export function load({ params }) {
	const essay = data.essays.find((e) => e.slug === params.slug);
	if (!essay) throw error(404, 'Not found');
	return { essay };
}
