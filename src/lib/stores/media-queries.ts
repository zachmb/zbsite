import { readable } from 'svelte/store';

// https://github.com/pearofducks/svelte-match-media/blob/master/index.js
const setupMediaQuery = (query: string) => (set: (matches: boolean) => void) => {
	const mediaQueryList = window.matchMedia(query);

	const callback = (event: MediaQueryListEvent) => set(event.matches);
	mediaQueryList.addEventListener('change', callback);

	set(mediaQueryList.matches);
	return () => mediaQueryList.removeEventListener('change', callback);
};

export const systemPrefersDark = readable(false, setupMediaQuery('(prefers-color-scheme: dark)'));
