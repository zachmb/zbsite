import type { Attachment } from 'svelte/attachments';

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

type TextGlitchOptions = {
	speedMs: number;
	delayBetweenLetters: number;
	iterationsPerLetter: number;
	charSet: string[];
};

type TextGlitchLetterElement = HTMLSpanElement & { dataset: { original: string } };

const animateLetter = (element: TextGlitchLetterElement, options: TextGlitchOptions) => {
	let iterations = 0;

	element.classList.add('changing');

	const interval = setInterval(() => {
		element.textContent = options.charSet.randomPick();

		if (iterations >= options.iterationsPerLetter) {
			clearInterval(interval);

			element.textContent = element.dataset.original;
			element.classList.remove('changing');
		}

		iterations++;
	}, options.speedMs);
};

// https://codepen.io/mpeach/pen/dXyoPL
export const textGlitch =
	(options: Partial<TextGlitchOptions> = {}): Attachment =>
	(element) => {
		if (element.children.length) throw new Error('Element must not have children');

		const mergedOptions: TextGlitchOptions = {
			speedMs: 40,
			delayBetweenLetters: 100,
			iterationsPerLetter: 5,
			charSet: [
				'!',
				'#',
				'$',
				'0',
				'1',
				'2',
				'3',
				'4',
				'5',
				'6',
				'A',
				'G',
				'T',
				'H',
				'Y',
				'Z',
				'X',
				'W',
				'O',
				'K',
				'Q',
				'S'
			],
			...options
		};

		mergedOptions.charSet = Array.from(new Set(mergedOptions.charSet.map((char) => char.trim()))); // unique chars only
		const text = element.textContent;

		element.classList.add('text-glitch');
		element.innerHTML = '';

		text.split(' ').forEach((word, i, words) => {
			const wordSpan = document.createElement('span');
			wordSpan.classList.add('word');

			word.split('').forEach((char) => {
				const charSpan = document.createElement('span') as TextGlitchLetterElement;
				charSpan.classList.add('char');
				charSpan.textContent = char;
				charSpan.dataset.original = char;
				wordSpan.appendChild(charSpan);
			});

			wordSpan.addEventListener('mouseenter', () =>
				Array.from(wordSpan.querySelectorAll('.char')).forEach((charSpan, i) =>
					setTimeout(() => {
						animateLetter(charSpan as TextGlitchLetterElement, mergedOptions);
					}, mergedOptions.delayBetweenLetters * i)
				)
			);

			element.appendChild(wordSpan);
			if (i < words.length - 1) element.appendChild(document.createTextNode(' '));
		});
	};
