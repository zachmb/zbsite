import type { SvelteHTMLElements } from 'svelte/elements';

export const generateRandomSquarePng = (size: number) => {
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;

	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Canvas 2D context not available');

	const imageData = ctx.createImageData(canvas.width, canvas.height);
	const d = imageData.data;
	for (let i = 0; i < d.length; i += 4) {
		d[i] = Math.floor(Math.random() * 256);
		d[i + 1] = Math.floor(Math.random() * 256);
		d[i + 2] = Math.floor(Math.random() * 256);
		d[i + 3] = 255;
	}

	ctx.putImageData(imageData, 0, 0);
	const dataUrl = canvas.toDataURL('image/png');
	return dataUrl;
};

export const randomIntBetween = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

export const times = (n: number) => Array.from({ length: n });

export const withoutProps = <T extends SvelteHTMLElements[keyof SvelteHTMLElements]>(
	props: T,
	...keys: (keyof T)[]
) => {
	const result = { ...props };
	for (const key of keys) delete result[key];
	return result as OmitFix<T, (typeof keys)[number]>;
};
