import '../app.css';

export const prerender = true;

Array.prototype.randomPick = function <T>(): T {
	return this[Math.floor(Math.random() * this.length)];
};

Number.prototype.clamp = function (min: number, max: number): number {
	return Math.min(Math.max(this.valueOf(), min), max);
};

Boolean.random = function (chance: number = 50): boolean {
	return Math.random() < chance.clamp(0, 100) / 100;
};
