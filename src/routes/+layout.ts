import '../app.css';

export const prerender = true;

Array.prototype.randomPick = function <T>(): T {
	return this[Math.floor(Math.random() * this.length)];
};

Number.prototype.clamp = function (min: number, max: number): number {
	return Math.min(Math.max(this.valueOf(), min), max);
};
