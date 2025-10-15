import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { JSONSerializable } from '@madkarma/ts-utils/types';

export type WidenLiteral<T> = T extends number
	? number
	: T extends string
		? string
		: T extends boolean
			? boolean
			: T extends undefined
				? undefined
				: T;

const storable = <T extends JSONSerializable>(
	key: string,
	initial: T,
	options: Partial<{
		serialize: (value: WidenLiteral<T>) => string;
		deserialize: (value: string) => WidenLiteral<T>;
		saveInitial: boolean;
	}> = {}
) => {
	const { subscribe, set, update } = writable(initial as WidenLiteral<T>);

	const opts: Required<typeof options> = {
		serialize: JSON.stringify,
		deserialize: JSON.parse,
		saveInitial: true,
		...options
	};

	let skipNextSave = false;

	if (browser) {
		const storedValue = localStorage.getItem(key);
		if (storedValue) set(opts.deserialize(storedValue));
		else if (!opts.saveInitial) skipNextSave = true;
	}

	subscribe((value) => {
		if (!browser) return;

		if (skipNextSave) {
			skipNextSave = false;
			return;
		}

		localStorage.setItem(key, opts.serialize(value));
	});

	const _reset = () => set(initial as WidenLiteral<T>);

	return {
		subscribe,
		set,
		update,
		reset: _reset,
		remove: (reset = true) => {
			if (!browser) return;

			localStorage.removeItem(key);

			if (!reset) return;

			skipNextSave = true;
			_reset();
		}
	};
};

export default storable;
