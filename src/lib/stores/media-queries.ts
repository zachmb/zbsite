import { browser } from '$app/environment';
import { readable } from 'svelte/store';

// https://github.com/pearofducks/svelte-match-media/blob/master/index.js
const setupMediaQuery = (query: string) => (set: (matches: boolean) => void) => {
	if (browser) {
		const mediaQueryList = window.matchMedia(query);

		const callback = (event: MediaQueryListEvent) => set(event.matches);
		mediaQueryList.addEventListener('change', callback);

		set(mediaQueryList.matches);
		return () => mediaQueryList.removeEventListener('change', callback);
	} // maybe it'll break in the future if I don't return anything here?
};

export const systemPrefersDark = readable(true, setupMediaQuery('(prefers-color-scheme: dark)'));
