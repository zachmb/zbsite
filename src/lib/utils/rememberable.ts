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
	options: { serialize: (value: T) => string; deserialize: (value: string) => T } = {
		serialize: JSON.stringify,
		deserialize: JSON.parse
	}
) => {
	const { subscribe, set, update } = writable(initial);

	if (browser) {
		const storedValue = localStorage.getItem(key);
		if (storedValue) set(options.deserialize(storedValue));
	}

	subscribe((value) => {
		if (browser) localStorage.setItem(key, options.serialize(value));
	});

	return {
		subscribe,
		set,
		update
	};
};

export default rememberable;
