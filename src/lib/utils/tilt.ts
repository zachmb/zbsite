import type { Attachment } from 'svelte/attachments';

export interface TiltOptions {
	scale: number;
	/** Max tilt rotation (in degrees) */
	max: number;
	reverse: boolean;
	strength: number;
	/** The transition time in MS. */
	transition: number;
	xAxis: boolean;
	yAxis: boolean;
	/** Whether when the mouse leaves the box should recover. */
	recovery: boolean;
	/** The persepective number. Default is 1000px */
	perspective: string;
	easing: string;
}

// https://svelte.dev/playground/7b23ad9d2693424482cd411b0378b55b
// https://github.com/tristan-f-r/svelte-tilt/blob/main/src/lib/index.ts
const tilt =
	(options: Partial<TiltOptions> = {}): Attachment =>
	(element) => {
		const node = element as HTMLElement;

		let settings: TiltOptions = {
			scale: 1,
			max: 15,
			reverse: true,
			strength: 1,
			transition: 300,
			xAxis: true,
			yAxis: true,
			recovery: true,
			perspective: '1000px',
			easing: 'cubic-bezier(.03,.98,.52,.99)',
			...options
		};

		const onMouseMove = (e: MouseEvent) => {
			const { width, height, left, top } = node.getBoundingClientRect();
			const percentageX = Math.min(Math.max((e.clientX - left) / width, 0), 1);
			const percentageY = Math.min(Math.max((e.clientY - top) / height, 0), 1);

			const twiceMax = settings.max * 2;
			const reverse = settings.reverse ? 1 : -1;

			const tiltX =
				(settings.xAxis ? settings.max - percentageY * twiceMax : 0) * reverse * settings.strength;
			const tiltY =
				(settings.yAxis ? percentageX * twiceMax - settings.max : 0) * reverse * settings.strength;

			node.style.transform =
				`perspective(${settings.perspective}) ` +
				`rotateX(${tiltX}deg) ` +
				`rotateY(${tiltY}deg) ` +
				`scale3d(${Array(3).fill(settings.scale).join(', ')})`;

			node.dispatchEvent(
				new CustomEvent('tilt', { detail: { percentageX, percentageY, tiltX, tiltY } })
			);
		};

		let animationId: number | null = null;
		const smoothTransition = () => {
			if (animationId !== null) cancelAnimationFrame(animationId);

			node.style.transition = `${settings.transition}ms ${settings.easing}`;

			animationId = requestAnimationFrame(() => {
				animationId = requestAnimationFrame(() => {
					node.style.transition = '0s';
					animationId = null;
				});
			});
		};

		const onMouseLeave = () => {
			if (!settings.recovery) return;
			smoothTransition();
			node.style.transform =
				`perspective(${settings.perspective}) ` +
				`rotateX(0deg) ` +
				`rotateY(0deg) ` +
				`scale3d(1, 1, 1)`;
		};

		const onMouseEnter = () => {
			smoothTransition();
			node.style.willChange = 'transform';
		};

		node.style.transformStyle = 'preserve-3d';

		node.addEventListener('mousemove', onMouseMove);
		node.addEventListener('mouseleave', onMouseLeave);
		node.addEventListener('mouseenter', onMouseEnter);

		return () => {
			if (animationId !== null) cancelAnimationFrame(animationId);

			node.removeEventListener('mousemove', onMouseMove);
			node.removeEventListener('mouseleave', onMouseLeave);
			node.removeEventListener('mouseenter', onMouseEnter);
		};
	};

export default tilt;
