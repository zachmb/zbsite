<script lang="ts">
</script>

<section
	class="
		before:orbitron-700
		before:text-primary // Opposite color
		relative
		flex
		h-screen
		items-center
		justify-center
		z-10
		before:pointer-events-none
		before:absolute
		before:top-1/2
		before:left-1/2
		before:z-0
		before:w-full
		before:-translate-x-1/2
		before:-translate-y-1/2
		before:text-center
		before:opacity-40
		before:content-[attr(data-title)]
		before:select-none"
	data-title="But Seriously..." >
	<div class="text-white text-center max-w-4xl px-4">
		<h1 class="text-3xl font-bold text-quaternary">
			Check out my <a href="https://www.linkedin.com/in/zacharybas" class="text-tertiary hover:underline text-white">LinkedIn</a> and send me a connection request.
		</h1>
	</div>
</section>

<style>
	section::before {
		font-size: clamp(1rem, 15vw, 10rem);
	}

	/* Define the custom Tailwind keyframe for a subtle, slow pulse */
	@keyframes pulse-slow {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.85; /* Slightly less noticeable dip than default 'pulse' */
		}
	}

	/* Apply the keyframe as a utility class */
	.animate-pulse-slow {
		animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>