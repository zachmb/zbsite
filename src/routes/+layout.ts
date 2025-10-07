import '../app.css';

export const prerender = true;

Array.prototype.randomPick = function <T>(): T {
	return this[Math.floor(Math.random() * this.length)];
};
