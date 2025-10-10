import { writable, readable } from 'svelte/store';
import rememberable from '$utils/rememberable';
import { browser } from '$app/environment';

export const showEasterEgg = writable(false);

export const flashbang = rememberable('FLASHBANG_ME', false, { saveInitial: false });

export const theme = rememberable<'light' | 'dark' | 'auto'>('theme', 'auto');

export const userHasInteracted = readable(false, (set) => {
	if (!browser) return;

	let interval = setInterval(() => {
		const interacted = navigator.userActivation.hasBeenActive;
		if (interacted) {
			set(true);
			clearInterval(interval);
		}
	}, 100);
});
