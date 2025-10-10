import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type JSONPrimitive = string | number | boolean | null | undefined;

type Serializable =
	| JSONPrimitive
	| Serializable[]
	| {
			[key: string]: Serializable;
	  };

const rememberable = <T extends Serializable>(
	key: string,
	initial: T,
	options: Partial<{
		serialize: (value: T) => string;
		deserialize: (value: string) => T;
		saveInitial: boolean;
	}> = {}
) => {
	const { subscribe, set, update } = writable(initial);

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

	const _reset = () => set(initial);

	return {
		subscribe,
		set,
		update,
		reset: _reset,
		remove: (reset: boolean = opts.saveInitial) => {
			if (!browser) return;

			localStorage.removeItem(key);

			if (!reset) return;

			skipNextSave = true;
			_reset();
		}
	};
};

export default rememberable;
