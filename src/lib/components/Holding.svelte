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
		**:z-1
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
	data-title="Zabasi Group"
>
	<h1 class="text-white text-3xl font-bold text-quaternary">
		I own <a href="https://www.glasscoral.com/" class="text-tertiary hover:underline text-white"
			>GlassCoral</a
		> -- a holding company for my ventures
	</h1>
</section>

<style>
	section::before {
		font-size: clamp(1rem, 15vw, 10rem);
	}
</style>
