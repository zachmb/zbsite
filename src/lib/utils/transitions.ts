import { browser } from '$app/environment';
import type { Attachment } from 'svelte/attachments';
import type { AutoCompleteStr } from '@madkarma/ts-utils/types';

// https://codepen.io/kevinpowell/pen/xbGeNQy/ef22ccea0c2d257ae1a748f5fd4646da

export const transition = (action: () => void) => {
	if (!browser || !document.startViewTransition) return action();
	document.startViewTransition(action);
};

export const transitionName =
	(name: AutoCompleteStr<'none'>): Attachment =>
	(element) => {
		const node = element as HTMLElement;
		node.style.viewTransitionName = name;
	};
