// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Array<T> {
		randomPick(): T;
	}

	interface Number {
		clamp(min: number, max: number): number;
	}

	interface BooleanConstructor {
		random(chance?: number): boolean;
	}
}

export {};
