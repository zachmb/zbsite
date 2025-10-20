import { writable, readable } from 'svelte/store';
import storable from '@madkarma/svelte-storable';
import { browser } from '$app/environment';

export const showEasterEgg = writable(false);

export const flashbang = storable('FLASHBANG_ME', false, { saveInitial: false });

export const theme = storable<'light' | 'dark'>('theme', 'dark');

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
