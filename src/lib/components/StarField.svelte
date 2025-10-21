<script lang="ts">
	import { onMount } from 'svelte';
	import { randomIntBetween } from '$utils';

	type Props = {
		count?: number;
		maxHeightPercent?: number;
	};
	const { count = 750, maxHeightPercent = 100 }: Props = $props();

	let canvas: HTMLCanvasElement;

	const maxHeightFraction = maxHeightPercent / 100;

	// Vertex shader - handles star positions
	const vertexShaderSource = `
		attribute vec2 a_position;
		attribute float a_size;
		attribute float a_phase;
		uniform float u_time;
		uniform vec2 u_resolution;
		varying float v_alpha;

		void main() {
			// Convert from pixels to clip space (-1 to 1)
			vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
			clipSpace.y *= -1.0;

			gl_Position = vec4(clipSpace, 0.0, 1.0);
			gl_PointSize = a_size;

			// Calculate twinkling alpha based on time and phase
			float cycle = mod(u_time + a_phase, 1.0);
			v_alpha = abs(sin(cycle * 3.14159));
		}
	`;

	// Fragment shader - handles star appearance
	const fragmentShaderSource = `
		precision mediump float;
		varying float v_alpha;

		void main() {
			// Make stars circular
			vec2 coord = gl_PointCoord - vec2(0.5);
			float dist = length(coord);
			if (dist > 0.5) discard;

			// Soft edges
			float alpha = (1.0 - dist * 2.0) * v_alpha;
			gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
		}
	`;

	// Compile shader
	function createShader(gl: WebGLRenderingContext, type: number, source: string) {
		const shader = gl.createShader(type);
		if (!shader) return null;
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error('Shader compile error:', gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	}

	// Create program
	function createProgram(gl: WebGLRenderingContext) {
		const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
		const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
		if (!vertexShader || !fragmentShader) return null;

		const program = gl.createProgram();
		if (!program) return null;
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error('Program link error:', gl.getProgramInfoLog(program));
			return null;
		}

		return program;
	}

	// Generate star data
	function generateStars(
		canvasWidth: number,
		canvasHeight: number,
		starCount: number,
		heightFraction: number
	) {
		const stars: number[] = [];
		for (let i = 0; i < starCount; i++) {
			const x = Math.random() * canvasWidth;
			const y = Math.random() * heightFraction * canvasHeight;
			const size = randomIntBetween(1, 3);
			const phase = Math.random(); // Random phase for twinkle timing
			stars.push(x, y, size, phase);
		}
		return stars;
	}

	onMount(() => {
		const gl = canvas.getContext('webgl');
		if (!gl) {
			console.error('WebGL not supported');
			return;
		}

		const program = createProgram(gl);
		if (!program) return;

		gl.useProgram(program);

		const stars = generateStars(canvas.width, canvas.height, count, maxHeightFraction);

		// Create buffers
		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(stars), gl.STATIC_DRAW);

		// Set up attributes
		const positionLoc = gl.getAttribLocation(program, 'a_position');
		const sizeLoc = gl.getAttribLocation(program, 'a_size');
		const phaseLoc = gl.getAttribLocation(program, 'a_phase');

		const stride = 4 * 4; // 4 floats per star * 4 bytes per float
		gl.enableVertexAttribArray(positionLoc);
		gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, stride, 0);
		gl.enableVertexAttribArray(sizeLoc);
		gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, stride, 2 * 4);
		gl.enableVertexAttribArray(phaseLoc);
		gl.vertexAttribPointer(phaseLoc, 1, gl.FLOAT, false, stride, 3 * 4);

		// Set up uniforms
		const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
		const timeLoc = gl.getUniformLocation(program, 'u_time');
		gl.uniform2f(resolutionLoc, canvas.width, canvas.height);

		// Enable blending for transparency
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		// Animation loop
		const startTime = Date.now();
		let animationId: number;

		const render = createRenderFunction(
			gl,
			canvas,
			timeLoc,
			count,
			() => startTime,
			(id: number) => (animationId = id)
		);

		const handleResize = createResizeHandler(gl, canvas, resolutionLoc, count, maxHeightFraction);

		window.addEventListener('resize', handleResize);
		handleResize(); // Initial sizing
		render();

		// Cleanup
		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animationId);
		};
	});

	// Render function
	function createRenderFunction(
		gl: WebGLRenderingContext,
		canvas: HTMLCanvasElement,
		timeLoc: WebGLUniformLocation | null,
		starCount: number,
		getStartTime: () => number,
		setAnimationId: (id: number) => void
	) {
		return function render() {
			const currentTime = (Date.now() - getStartTime()) / 3000; // Slow down animation

			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);

			gl.uniform1f(timeLoc, currentTime);
			gl.drawArrays(gl.POINTS, 0, starCount);

			setAnimationId(requestAnimationFrame(render));
		};
	}

	// Handle resize
	function createResizeHandler(
		gl: WebGLRenderingContext,
		canvas: HTMLCanvasElement,
		resolutionLoc: WebGLUniformLocation | null,
		starCount: number,
		heightFraction: number
	) {
		return function handleResize() {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
			gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
			gl.viewport(0, 0, canvas.width, canvas.height);

			// Regenerate star positions for new canvas size
			const newStars = generateStars(canvas.width, canvas.height, starCount, heightFraction);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newStars), gl.STATIC_DRAW);
		};
	}
</script>

<canvas bind:this={canvas} class="pointer-events-none absolute inset-0 block h-full w-full">
</canvas>
